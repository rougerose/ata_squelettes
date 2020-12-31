import { config } from "./config";
import { emitEvents } from "../util/emitEvents";
import tippy from "tippy.js";

export class Keywords {
    constructor(containerElement) {
        this._container = containerElement;
        this._keywordsValues = [];
        this._deleteBtnListener = this._onclickDeleteBtn.bind(this);
        // Mots-clés activités
        this._activityKeywords = this._container.querySelectorAll(
            "." + config.keywords.activities.liClassName
        );
        this._activityKeywords.forEach((keyword) => {
            keyword.addEventListener("click", this._onclickActivityKeyword);
        });
        emitEvents(this._container, "init", "keywords");
    }

    addKeyword(keyword) {
        const label = keyword.label;
        const value = keyword.value;

        // Vérifier si le mot-clé n'a pas déjà été sélectionné
        if (this._keywordsValues.indexOf(value) == -1) {
            this._keywordsValues.push(value);
            // Afficher le mot-clé saisi
            const markup = this._addMarkup(label, value);
            // Mettre à jour la carte
            emitEvents(
                this._container,
                "update",
                this._keywordsValues
            );
        }
    }

    removeKeyword(keywordEl) {
        const keyword = keywordEl.dataset.value;
        const index = this._keywordsValues.indexOf(keyword);
        if (index !== -1) {
            this._keywordsValues.splice(index, 1);
            // Si la liste est vide, supprimer <ul>
            if (this._keywordsValues.length == 0) {
                keywordEl.parentElement.remove();
            } else {
                keywordEl.remove();
            }
            // Mettre à jour la carte
            emitEvents(
                this._container,
                "update",
                this._keywordsValues
            );
        }
    }

    _onclickDeleteBtn(event) {
        const btn = event.target;
        btn.removeEventListener("click", this._deleteBtnListener);
        const keywordEl = btn.parentElement;
        this.removeKeyword(keywordEl);
    }

    _addMarkup(label, value) {
        // <li>
        const li = document.createElement("li");
        li.className = config.keywords.liClassName;
        li.dataset.value = value;

        // <span>
        const span = document.createElement("span");
        const classStr = config.keywords.labelClassName;
        // La clé permet de déterminer l'icone de la catégorie à afficher
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

        span.className = classStr + " " + classStr + category;

        // Tronquer un intitulé excédent un nombre de caractères défini
        label = this._truncateLabel(label);
        span.appendChild(document.createTextNode(label.text));

        /*
        Si le texte de l'intitulé est partiel, on ajoute un attribut alt.
        Puis, ajout un bouton pour afficher un tooltip (avec la lib Tippy.js)
        */
        let tooltip = null;
        if (label.alt.length > 0) {
            span.setAttribute("data-tippy-content", label.alt);
            tooltip = document.createElement("button");
            tooltip.className = config.keywords.tooltipClassName;
        }

        // <button>
        const btn = document.createElement("button");
        btn.className = config.keywords.btnDeleteClassName;
        btn.setAttribute("aria-label", "Supprimer ce critère de recherche");
        btn.addEventListener("click", this._deleteBtnListener);

        /*
        Ajouter le span, le bouton supprimer
        et éventuellement le bouton tootip
        à la balise li
        */
        li.appendChild(span);
        if (tooltip) {
            li.appendChild(tooltip);
            tippy(tooltip, {
                content: label.alt,
                theme: "ata-light-border",
                placement: "bottom",
                hideOnClick: false,
            });
        }
        li.appendChild(btn);

        // Identifier le conteneur des mots-clés
        const container = this._container.querySelector(
            config.keywords.containerId
        );

        // Une liste est déjà présente ?
        let ul = container.firstChild;
        if (!ul) {
            ul = document.createElement("ul");
            ul.className = config.keywords.ulClassName;
        } else {
            // Todo : vérifier si message "Aucun résultat" est présent
        }

        ul.appendChild(li);
        container.appendChild(ul);
    }

    _truncateLabel(label) {
        // longueur maximum des intitulés de mots-clés
        const maxLength = 15;
        let alt = "";

        if (label.length > maxLength) {
            let parenthese = label.indexOf("(");
            /**
             * Si l'intitulé contient des parenthèses,
             * c'est le texte avant la première parenthèse
             * qui est conservé pour l'intitulé.
             * Mais à condition qu'il respecte la longueur maximum.
             * Sinon on ne garde dans l'intitulé que le nombre
             * de caractères requis.
             *
             * L'intitulé complet est ajouté dans l'attribut alt du span.
             */
            if (parenthese !== -1 && parenthese < maxLength) {
                alt = label;
                label = label.slice(0, parenthese - 1);
            } else {
                alt = label;
                label = label.slice(0, maxLength);
            }
        }
        return (label = { text: label, alt: alt });
    }
}
