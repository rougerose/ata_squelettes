export const config = {
    windowBreakpoint: 768,
    markerSize: {
        xs: 34,
        s: 44,
        m: 54,
        l: 64,
        xl: 74,
        xxl: 84,
    },
    searchBox: {
        btnAdvancedId: "#openAdvancedSearch",
        panelClassName: "mp-SearchBox_Panel",
    },
    keywords: {
        ulClassName: "mp-Keywords_List",
        liClassName: {
            main: "mp-Keywords_Item",
            variant: "mp-Keywords_Item-selected",
        },
        labelClassName: "mp-Keywords_Label",
        btnDeleteClassName: "mp-Keywords_BtnDelete",
    },
    modal: {
        setTabIndex: true,
        openedClass: "is-opened",
        closedClass: "is-closed",
        bottomBarClass: "mp-Modal_Bar",
        containerId: "Modal",
    },
};
