import { config } from "./config";
// import tippy from "tippy.js";

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
        const tippyBtn = el.querySelector(
            "." + config.keywords.tooltipClassName
        );
        // Si un tooltip est présent, supprimer l'instance tippy
        // et les gestionnaires d'événements associés.
        if (tippyBtn) {
            // tippyBtn._tippy.destroy();
        }
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
        label = this._truncateLabel(label);
        span.appendChild(document.createTextNode(label.text));

        // Si le texte de l'intitulé est partiel, on ajoute un attribut alt.
        // Puis, ajout un bouton pour afficher un tooltip (avec la lib Tippy.js)
        let tooltip = null;
        if (label.alt.length > 0) {
            span.setAttribute("data-tippy-content", label.alt);
            tooltip = document.createElement("button");
            tooltip.className = "o-btn " + config.keywords.tooltipClassName;
        }

        // <button>
        const btn = document.createElement("button");
        btn.className = "o-btn " + config.keywords.btnDeleteClassName;
        btn.setAttribute("aria-label", "Supprimer ce critère de recherche");
        btn.addEventListener("click", this._deleteListener);

        // Ajouter à la balise li :
        // le span, le bouton supprimer et éventuellement le bouton tootip
        li.appendChild(span);
        if (tooltip) {
            li.appendChild(tooltip);
            // tippy(tooltip, {
            //     content: label.alt,
            //     theme: "ata-light-border",
            //     placement: "bottom",
            //     hideOnClick: false,
            // });
        }
        li.appendChild(btn);

        return li;
    }

    // Tronquer un intitulé excédent un nombre de caractères défini
    _truncateLabel(label) {
        // longueur maximum des intitulés de mots-clés
        const maxLength = 15;
        let alt = "";

        if (label.length > maxLength) {
            /*  Si l'intitulé contient des parenthèses,
                c'est le texte avant la première parenthèse
                qui est conservé pour l'intitulé.
                Mais à condition qu'il respecte la longueur maximum.
                Sinon on ne garde dans l'intitulé que le nombre
                de caractères requis.
                L'intitulé complet est ajouté dans l'attribut alt du span.
            */
            // let parenthese = label.indexOf("(");
            // if (parenthese !== -1 && parenthese < maxLength) {
            //     alt = label;
            //     label = label.slice(0, parenthese - 1);
            // } else {
            //     alt = label;
            //     label = label.slice(0, maxLength);
            // }
        }

        return (label = { text: label, alt: alt });
    }
}
