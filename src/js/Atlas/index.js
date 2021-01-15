import { AtlasBase } from "./AtlasBase";
// Les modules ci-dessous sont appelés ici,
// mais ils seront initialisés dans AtlasBase
import { SearchBox } from "./SearchBox";
import { Keyword } from "./Keyword";
import { KeywordSelected } from "./KeywordSelected";
import { Modal } from "./Modal";

let atlas;
let state = {
    windowWidth: null,
    searchboxHeight: null,
    keywords: new Map(),
    keywordsSelected: new Map(),
    modal: {
        action: "",
        openId: "",
        position: "closed",
    },
};

let init = (leafletmap) => {
    let conf = {
        containerId: "atlas",
        controls: [SearchBox, Keyword, KeywordSelected, Modal],
        dispatch: function dispatch(action) {
            state = atlas.handleAction(state, action);
            atlas.syncState(state);
        },
    };
    atlas = new AtlasBase(leafletmap, state, conf);
    // compléter state.windowWidht et state.searchboxHeight
    atlas.setupState();
}

const addKeyword = (keyword) => {
    atlas.autocompleteAddKeyword(keyword);
}


export { init, addKeyword };
