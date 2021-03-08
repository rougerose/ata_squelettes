import { config } from "./config";

// TODO : Ajouter un role Listbox sur le html + gestion du focus ?

export class KeywordSelected {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this.dispatch = dispatch;
        this.container = container.querySelector("#KeywordSelected");
        this._deleteListener = this._deleteEvent.bind(this);
        this.container.addEventListener("animationstart", () => {
            this.dispatch({
                type: "updateSearchboxHeight",
                searchboxHeight: null,
            });
        });
    }

    syncState(state) {
        if (state.keywordsSelected.size !== this.state.keywordsSelected.size) {
            this.state = state;
            if (state.keywordsSelected.size > 0) {
                this.updateKeywordSelectedList();
            }
        }
        this.state = state;
    }

    updateKeywordSelectedList() {
        // récupérer ou créer <ul>
        let list = this.getUL();
        // Avant d'afficher tous les mots-clés demandés,
        // supprimer ceux déjà présents
        let listItems = list.querySelectorAll("li");
        for (let index = 0; index < listItems.length; index++) {
            this.removeKeyword(listItems[index], false);
        }
        //
        for (const [key, val] of this.state.keywordsSelected) {
            let keyword = this.addKeyword(key, val);
            list.appendChild(keyword);
        }
        this.dispatch({ type: "updateKeywordSelectedList" });
    }

    dispatchAction(action, keyword) {
        this.dispatch({
            type: action,
            keyword: keyword,
        });
    }

    getUL() {
        let ul = this.container.firstElementChild;
        if (!ul) {
            ul = document.createElement("ul");
            ul.className = config.keywords.ulClassName;
            this.container.appendChild(ul);
        }
        return ul;
    }

    addKeyword(value, label) {
        let li = this._addMarkupLi(value, label);
        return li;
    }

    removeKeyword(el, removeParent) {
        const parent = el.parentNode;
        el.remove();

        if (removeParent && !parent.firstElementChild) {
            parent.remove();
            this.dispatch({
                type: "updateSearchboxHeight",
                searchboxHeight: null,
            });
        }
    }

    _deleteEvent(event) {
        let btn = event.target;
        btn.removeEventListener("click", this._deleteListener);
        const keywordElement = btn.parentElement;
        this.removeKeyword(keywordElement, true);
        const keyword = {
            value: keywordElement.dataset.value,
            label: keywordElement.dataset.label,
        };
        this.dispatchAction("removeKeywordSelected", keyword);
    }

    _addMarkupLi(value, label) {
        // <li>
        const li = document.createElement("li");
        // li.class
        const liClassFrag1 = config.keywords.liClassName.main;
        const liClassFrag2 = config.keywords.liClassName.variant;
        // La clé du mot-clé permet de déterminer
        // l'icone de la catégorie à afficher
        const key = value.split(":");
        let category;
        switch (key[0]) {
            case "id_association":
                category = "-org";
                break;
            case "id_adresse":
                category = "-city";
                break;
            case "id_mot":
                category = "-activity";
        }
        let liClassName = liClassFrag1;
        liClassName += " " + liClassFrag1 + category;
        liClassName += " " + liClassFrag2;
        li.className = liClassName;
        // li dataset
        li.dataset.value = value;
        li.dataset.label = label;

        // span
        const span = document.createElement("span");
        span.className = config.keywords.labelClassName;
        span.appendChild(document.createTextNode(label));

        // <button>
        const btn = document.createElement("button");
        btn.className = "o-btn " + config.keywords.btnDeleteClassName;
        btn.setAttribute("aria-label", "Supprimer ce critère de recherche");
        btn.addEventListener("click", this._deleteListener);

        // Ajouter à la balise li :
        // le span, le bouton supprimer
        li.appendChild(span);
        li.appendChild(btn);

        return li;
    }
}
