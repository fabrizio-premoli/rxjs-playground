import {
	MonoTypeOperatorFunction,
	VirtualTimeScheduler,
	SchedulerLike,
	Observable,
	defer,
	isObservable,
} from "rxjs";
import {
	ObservableGroup,
	ObservableHistory,
	ObservableEvent,
	ObservableGroups,
} from "./ObservableGroups";
import { computed, observable, trace } from "mobx";
import { tap, take } from "rxjs/operators";
import { ObservableComputer, Observables } from "./types";
import { sortByNumericKey } from "../std/utils";

export type TrackFn = <T>(name?: string) => MonoTypeOperatorFunction<T>;

export class TrackingEvent implements ObservableEvent {
	private static id = 0;
	public readonly id = TrackingEvent.id++;

	constructor(public readonly time: number, public readonly data: unknown) {}
}

export abstract class TrackingObservableGroupBase extends ObservableGroup {
	@computed
	public get visibleObservables(): Map<string, ObservableHistory> {
		const groups = [...this.groups.groups]
			.map((g, idx) => ({ g, idx }))
			.sort(sortByNumericKey(g => g.g.getPositionSortKey(g.idx)));

		const observables = new Map<string, ObservableHistory>();

		for (const g of groups) {
			if (g.g === this) {
				break;
			}
			if (g.g.resultingObservableHistory) {
				observables.set(g.g.name, g.g.resultingObservableHistory);
			}
		}
		return observables;
	}

	@computed
	public get observables(): ObservableHistory[] {
		if (this.dispose.disposed) {
			console.log(`computed ${this.name}.observables, but is disposed`);
			return [];
		}

		const scheduler = new VirtualTimeScheduler();
		scheduler.maxFrames = 1000 * 1000 * 1000;
		const trackedObservables = new Array<ObservableHistory>();
		const visibleObservables = this.getVisibleObservables(scheduler);
		const trackFn = this.getTrackFn(trackedObservables, scheduler);

		try {
			const obsOrError = this.getObservable(
				visibleObservables,
				scheduler,
				trackFn
			);
			if (typeof obsOrError === "object" && "error" in obsOrError) {
				console.error(obsOrError.error);
			} else {
				obsOrError.pipe(trackFn(() => this.name)).subscribe();
				scheduler.flush();
			}
		} catch (e) {
			console.error(e);
			return [];
		}

		return trackedObservables;
	}

	private getTrackFn(
		observableHistories: ObservableHistory[],
		scheduler: SchedulerLike
	): <T>(name?: string | (() => string)) => MonoTypeOperatorFunction<T> {
		return (name?: string | (() => string)) => {
			const n =
				typeof name === "string"
					? () => name
					: typeof name === "function"
					? name
					: () => "";

			return <T>(source: Observable<T>) => {
				return defer(() => {
					const history = new TrackingObservableHistory(n);
					observableHistories.unshift(history);
					return this.track<T>(source, scheduler, history);
				});
			};
		};
	}

	private track<T>(
		source: Observable<T>,
		scheduler: SchedulerLike,
		history: TrackingObservableHistory
	): Observable<T> {
		history.startTime = scheduler.now();
		return source.pipe(
			take(100),
			tap({
				next: n => {
					let data: unknown = n;
					if (isObservable(n)) {
						/*if ("key" in n) {
							data = { key: (n as any).key };
						}*/

						const h = new TrackingObservableHistory(() => "test");
						n.pipe(source =>
							this.track(source, scheduler, h)
						).subscribe();
						data = h;
					}

					history.trackedEvents.push(
						new TrackingEvent(scheduler.now(), data)
					);
				},
				complete: () => {
					history.endTime = scheduler.now();
				},
			})
		);
	}

	private getVisibleObservables(scheduler: SchedulerLike): Observables {
		const visibleObservables = {
			get: <T>(name: string): Observable<T> => {
				const o = this.visibleObservables.get(name);
				if (!o) {
					throw new Error(
						`There is no visible observable with name "${name}"!`
					);
				}
				return o.asObservable<T>(scheduler);
			},
		};
		for (const name of this.visibleObservables.keys()) {
			Object.defineProperty(visibleObservables, name, {
				get: () => visibleObservables.get(name as never),
			});
		}
		return visibleObservables;
	}

	protected abstract getObservable(
		observables: Observables,
		scheduler: SchedulerLike,
		track: TrackFn
	): Observable<unknown> | { error: string };

	constructor(private readonly groups: ObservableGroups) {
		super();
	}
}

export abstract class TrackingObservableGroup extends TrackingObservableGroupBase {
	@observable public observableCtor: ObservableComputer;

	protected getObservable(
		observables: Observables,
		scheduler: SchedulerLike,
		track: TrackFn
	) {
		return this.observableCtor(observables, scheduler, track);
	}

	constructor(groups: ObservableGroups, observableCtor: ObservableComputer) {
		super(groups);
		this.observableCtor = observableCtor;
	}

	public abstract reset(): void;
}

export class TrackingObservableHistory extends ObservableHistory {
	constructor(private readonly nameFn: () => string) {
		super();
	}

	public get name() {
		return this.nameFn();
	}

	public get events(): ReadonlyArray<ObservableEvent> {
		return this.trackedEvents;
	}

	@observable public startTime: number = 0;
	@observable public endTime: number | undefined = undefined;

	@observable public trackedEvents = new Array<ObservableEvent>();
}
