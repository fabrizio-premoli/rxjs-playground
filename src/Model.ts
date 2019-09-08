import { PlaygroundViewModel } from "./ViewModels/PlaygroundViewModel";
import {
	SerializeController,
	StringStore,
	UrlHashOrPostMessageStore,
} from "./ViewModels/SerializeController";
import { computed, action } from "mobx";
import { MobxConsoleLogger } from "@knuddels/mobx-logger";
import * as mobx from "mobx";

const logger = new MobxConsoleLogger(mobx, { useGroups: true });
window.logger = logger;

export class Model {
	public readonly playground = new PlaygroundViewModel();
	private readonly store: StringStore = new UrlHashOrPostMessageStore();

	@computed get selectedDemo(): Demo | undefined {
		return demos.find(d => d.serializedData === this.store.get());
	}

	@action
	setDemo(demo: Demo): void {
		this.store.set(demo.serializedData);
	}

	public readonly demos = demos;

	constructor() {
		new SerializeController(this.playground, this.store);
	}
}

export interface Demo {
	name: string;
	serializedData: string;
}

const demos: Demo[] = [
	{
		name: "delay",
		serializedData:
			"XQAAAAK_AQAAAAAAAABJINBuYDZsN5YTW6OHrMtN89ZdV25aFV-TlxujY6_B2yiluwYypyoRv82V4xDsvXgTGAcdgyBDJYQMNYmL8Er0i0AS0nT-aCxI4mFvK4dz_dhuNamE0PzbQlpxOKZ6W1rN6AqvRT7N5BCBXe4hLsoOhfqOVNfvt0QgnHTE0VG3pYpyUZeVp_YdD84n1RiVn1nOYZYxExyT8HrYbsd6ZjvSOEGEr5RDvhOvck6G1pHpdY6c_l0Rs9DCGxyPQ9XoSXDqBIqtc7aauhOL3EdhONtYnsK1w5jvRpPVySUg5bLMrwYPmcXqQ-2R8POB_VSXHOCbRXuRY1hokQb1Bm8dISB1_SwIQO-Mc1Nux__iU3R_",
	},
	{
		name: "merge",
		serializedData:
			"XQAAAAKzAgAAAAAAAABJoNBuYDZsN5YTW6OHrMtN89Y1bRpaFU6LpxujY6_62_sGCBGhggMKHkHaLvxThe6noA8ty8yc0tyZDoJiTijOH2pSZh0Q6JFdySlh1w47pXgZPkHAIbuHU8BzSQ3fU8og2jc-ehwGly8LUcQWHjKYQuoqyk6mRu5nVK3Lc_3zkLZ-kcdTH_PiltY8usC_oT9vNUC5wjV52nkRJniqvih83Yndz51g8KYax2QCa6oDsOMpB0HFzg8BBstKzJ3f1gtBIrChJvTnRJQg1afWBIYpWXP55d5FoMDhshanGIHr8kT5dP2o93wVjfUFxKwyAtjLas4PJ3wUf6XK9KCjnaTOfLTbufotkickARFYH2ZuLc9vrRxX-xgDbzDujTUevDdSW3pjONfhWou4zUJcEP_BgsAA",
	},
	{
		name: "groubBy",
		serializedData:
			"XQAAAAIXAwAAAAAAAABJIRBuYDZsN5YTW6OHrMtN89Z7RhGEaF6YnWUr_dplnzzkx8k3a4BftTzMxq321iiHa48lwnnzUsEXQu5h8Wq6a5AnJSlgG5tL4DZaygdCn30FtG1gmm5HuTUlaFTKjK7BcxaqCAZTkhntSgf4p1lHvBxCC3s7Ay6ozPHBBargAYHvvuw3zzY5xTjT7p5uUAOpL2BC5PeyexERh1LmqoEO1oix_BCztrpkkYtMo4aItMhyPgaHAefen6Dkzf6nI8GFI2mg6GvQfPiXnrqOo8sF2eZUlmSgMM9ObWDM96jsprKYrKmSlgi3qiynORs66F2BqhILvBJmPxHyH2hnLV-14leTOkYulyS6yUa1fCRa3Mo_e1TcsaSa1LPm156v21lX1-7X_NqSosfYxfAKZCqkja0XLQ6U-G9Oo86TJ7ytW7wtCjB_1-iu8fwiX4q3Ok3szwKynuZOJhf3c_C7acHP_8boAGA",
	},
	{
		name: "reduce / scan",
		serializedData:
			"XQAAAAI9AwAAAAAAAABJoRBuYDZsN5YTW6OHrMtN89ZxS3nDaEaGgWUr_c01-p_9x4Zbjd6s7Rn7TqLwjYtVN2WsjgoL8vITx1X1K4y8qn4odZewdlTEkqC7oPm4A9Y7WHrN7kwleiG3SdJmdhNaoiS_ZSt89smayShBd3l3TALr_JlILvqK82T8p8-aD6LO4tS5cCb7uafSzOyyBXakttfMSjSKdWgBqLBNREPpLVbSKG07X-kQ2SZxM8bPz-UbkfPQpb-HLCeZ-7tS4BQZ0Dc_wRdhbyRLdhj18gZadDBhCsnPEDNfmXY3-U1C9ScuCa0wnPkb2hpKd0_MZqtTWATaY4STIKYg_U_wf7U3-c2Kki9mV2QWI414TF5p_8dQ6TX_GE8N9wbPVP0Tgxh2mAEArt_HzOeKUaY08cEuuFxgNVLead6Jj_aYbzbxg65FvQKR4GcyHev9vwhu",
	},
	{
		name: "map, mergeMap, switchMap, concatMap",
		serializedData:
			"XQAAAAI9BgAAAAAAAABLIRBuYDZsN5YTW6OHrMtN89YrcWnDaEaGgWUr_dpRGkoEx8cSoA3LdOTjNGPkr77aiUEJerRDsjssFdTJjZcYBV2G3yDJB8v8PSXliz4gqdGmDUEeqpiY5v2WvDloPlOlca48ONoNPpqR6MfpYounOL78PfqSXL91U4X7d6FNTBIx7bKiPi7-fWzqyIhQXmpd2HgSfA719Qlx8t-sxWD_P2PbwPBvrSgYheBaYWDegYPMibI01y4eYwKnoKfvG_o50pYl1Y5E3HrSIsC2XkF-b4gOMZBWLZNO2182dYxh0snvfyxhtGbAeZnrREKy6oVIUoi05noQ8OLWc5P2gT2XUeUW9GS0Rh0zja3oNgPgVlSfsmdfBkShVDnJc48C2z0Nw993CN3_4nrX8IfgifxfmPWoM45-54l4-SCOTmPk0nVRmjUldSxaXr23veS_hLAWyam6ejyHWIgQ1xJgFPLEVBRUlbBiztExI4e-Ztq6BSb2h5GqW2Qt22JtTRD_SB7OAA",
	},
	{
		name: "throttleTime, auditTime, debounceTime",
		serializedData:
			"XQAAAALSBwAAAAAAAABLINBuYDZsN5YTW6OHrMtN89aFQcJaFV-TlxujY6DVBSz4m7mYQb4pN4--g9XOZafD8Zv_zlHjzqHaQvMD8W85iFZLi8zv4Hae58zTaJ-mTlYBb1JHN09WIHPJJnK_H_L3Oi7fQtsN88esDETb_YypcLxuFZKDSWY9kLCw4kyorGmi2O82iBu_M4O6olDqhA2HMoC-hFVWkQHMgrPWQ2V_AknTyKpVQzrx4IR7ow552Dno_nACWhF6P5IT4T28y6RzFuz1yWtkKCjQGy2msFoCTndX2io00kAwH0BmhPhdR8KOFVm_k_Vz3XEZOP-yZteRP75WLsiYruKY2-Us3o3tqPlWxbmetPKqNTBK63mgFi7KglK3dfmEDg8RkM7dJRHySS54bKetO47rqbZuxCBwgpp0GQKtvkwL07YnWK6RArzeSKdbb4Z43hxqSGt2o1_ePGL0S8R_x4bdmJSXaQviS9FUSATsMrcnmH6hjgxzDzMtG78pBMUQZEnJW5zlz2vm62clCH2Vq8z9HHTUBjFvIdXiwcqSrVyWVj8-zYWCJpSxY6LEUjTI4BNWjOLICaDi1_89ZCRhk3-XVlH7a9egojcahVKTQWHv3u15EvvHsq9ZA3PwNeAXE7bxoMQS3HtgDDzHOVUg4hZOn_ygRCo",
	},
	{
		name: "debounceTime per id",
		serializedData:
			"XQAAAALiBgAAAAAAAABJINBuYDZsN5YTW6OHrMtN89ka3ACLKZJcsjWBc_8R9x5qyysaC_7DiSdd8V6RnQv6JZLMGER4K0vG4oZUZDoiy3qcqqqGTZRX-2H_dLUszd_uD454Gts4h5dOHMOuijkdiurydxTmxDT6bRYZafb7pEuMII0Qf6arFLDH3VzTTGxAlZCxj-JGuquesyt5Kt4CxwLR33QPuz7zkJqvraaNEZ_zAHgjQKI3_ANoWAyNtpwlnM5KzlPw2K2tc12xhDFNlF7H_3gKvjLj-Yd4wSOk7gWNdSyvlOu7PdvfNTuTw1fuT3hgx3MXs4Nt60f3UQKwn7yWM_smDvHpZ9roH40XF2wI4r_9f6xxZF7GYYIMEl4Bs78nZMU6-QBDAu0Lp1KJgOmL3RwD5x-6Row84AFbauXVv19qysVvClG4REv1-pVFDQgXZjbRvMGDQG2qu4kqb9XTSjQLUAEg4QxZTcl5A-jAW3OO946mLP6KSkvAmMy8EJagjgNENfwQu6stUk-zCK24QheE3DjghNnkrQ-zfVJpOaD-LtNK2WQNGrnqTB1d7uvNkqiIBpxxaxvmPRVVyhc7SRCyIGhT3cWRIuzO7AP4u2Zr90QgYDkQc7yUyqO6HvlRfbSUZIzlKmaLDI9ROTZzSbL414vpqM-O-q3wpM7R971KmWa4JohP3-GAd0M0V37v4QvXxC2E-AAoR2GhLrMFE5mLcZEUCX1uiAROSNhrF8cCKSsKNaWC4bpwulKV5XhuxljHkPgejAEIqSVjrz6xbceyeEGG-ohSdu38YVxl",
	},
	{
		name: "window, windowCount, windowTime",
		serializedData:
			"XQAAAAJHBgAAAAAAAABLoNBuYDZsN5YTW6OHrMtN89aFQcJaFV-TlxujY6-3ddwZJmksfF6oN7UduJYaFX5Ky4x4VXUo9LZi0Sa8DBkT1nAeHGSN-r-DLg9JhdbLQmhnDdp8ukQvB_mkAyCDVXZSJVhEWZ-JYky3TZVY8v1YmJpaRPOLO6KVjDJ3m47eFyTGENzqOzrKncnCWMVg45FjLBu0XGbucvE77d2LtpX4uI65OVg_96JrH9bw4K98PPx8ig9EKfnPunOYHDsV906kbvlelyZiRNY67XtZQS-jpuxFTctrKdXaJOou1J15f65ShSXYEyPLgDTlB9gJrDd_Gg4D8n2nZtarGAvx6xcSTsmPg9GU561k-TFm3gIhs5vCD8qM5gfUE1JfeD-5dIMeAodqXTVN4yjqPeiWEhzK9kv3vNMzL3RNrdDPBts-FW6mkfuJxgs_fq-MJrNixN4owaNL5T_gyn6G-JDRR-En2R_a37ExBBE2cQp5D2hjpD3-snB90AzFU7U2Z9iTy0xrt7weJBdP71UIgAO27U2ARBBF8NpR1qRcBR0drLpgc6dBTCNe9ZwOf1_IOMAagBhrQS1CABBZ3cvkoDG8MeuhhdUHN2uj_7SQundefinedPM",
	},
];
