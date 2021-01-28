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
        containerId: "SearchBox",
        btnAdvancedId: "#openAdvancedSearch",
        panelClassName: "mp-SearchBox_Panel",
    },
    keywords: {
        containerClassName: "mp-Keywords-toSelect",
        ulClassName: "mp-Keywords_List",
        liClassName: {
            main: "mp-Keywords_Item",
            variant: "mp-Keywords_Item-selected",
        },
        labelClassName: "mp-Keywords_Label",
        btnDeleteClassName: "mp-Keywords_BtnDelete",
        tooltipClassName: "mp-Keywords_BtnTooltip",
        activities: {
            liClassName: "mp-Keywords_Item-toSelect",
            aClassName: "mp-Keywords_Label-activity",
        },
    },
    queryKeywords: {
        containerId: "js-Keywords",
    },
    modal: {
        setTabIndex: true,
        openedClass: "is-opened",
        closedClass: "is-closed",
        bottomBarClass: "mp-Modal_Bar",
        containerId: "Modal",
        btnClassName: "mp-Modal_BtnAction",
        headerClassName: "mp-Modal_HeaderContent",
        bodyClassName: "mp-Modal_Body",
        profile: {
            headerClassName: "mp-OrgProfile_Header",
            badge: {
                imgClassName: "mp-OrgProfile_Logo",
                figClassName: "mp-OrgProfile_Badge",
            },
            nameClassName: "mp-OrgProfile_Name",
        },
    },
};
