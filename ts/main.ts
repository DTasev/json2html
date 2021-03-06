/** 
 * JSON to HTML parser.
 * 
 * Copyright 2018 Dimitar Tasev
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose 
 * with or without fee is hereby granted, provided that the above copyright notice 
 * and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH 
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND 
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, 
 * OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
 * OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * @author Dimitar Tasev 2018
*/
function Parser() {
    let self = this;
    /**
    * Convert the JSON to HTML. 
    * - Usage:
    * ```
    * const description = {
    *   "div":{
    *       "className":"style1",
    *       "children":[{
    *          "input":{
    *               "id": "username-input-id",
    *               "type": "text",
    *               "onclick": "my-func-name()", //or just my-func-name, without quotation marks
    *           }
    *       },{
    *           "input":{
    *               "id": "password-input-id",
    *               "type": "password"
    *           }
    *       }]
    *   }
    * }
    * ```
    * Notable syntax is:
    * - Top level element:
    * ```
    * {
    * "div":
    *      // NOTE: properties here MUST match the properties available to the HTML element
    *      "className": "...",
    *       // will do nothing, as div doesn't support title
    *      "title":"..." 
    *      "..."
    * }
    * ```
    * - Child elements
    * ```
    * {
    * "div":
    *   "className": "my-div-style",
    *   // the list is used to preserve the order of the children
    *   "children":[{
    *       "a":{
    *           "text":"Apples",
    *           "className": "my-styles"
    *       }
    *   },{
    *       "input":{
    *           "className": "my-input-style"
    *       }
    *   }]
    * }
    * ```
    * @param dict Dictionary containing the description of the HTML
    */
    self.json2html = function (dict: {}): HTMLElement {
        const [parent_elem, props] = self.getParent(dict);

        Object.keys(props).forEach(function (key) {
            if (key === "children") {
                props["children"].forEach(element => {
                    parent_elem.appendChild(self.json2html(element));
                });
            } else {
                parent_elem[key] = props[key];
            }
        });

        return parent_elem;
    }

    /**
     * Create an HTML element from the key in the dictionary, return the values
     * @param dict Dictionary with 1 key, and some values
     * @returns HTMLElement of the key in the dictionary, and all of its values
     */
    self.getParent = function (dict: {}): [HTMLElement, {}] {
        let parent_elem: HTMLElement, props: {};
        // get the first key in the dictionary
        Object.keys(dict).forEach(function (key) {
            parent_elem = document.createElement(key);
            props = dict[key];
        });
        return [parent_elem, props];
    }
}

function myfunc() {
    alert("I have been summoned");
}

function main() {
    const id_in_variable = "apples";
    const elem = {
        "div": {
            "className": "w3-row w3-dark-grey w3-padding issue-margin-bottom",
            "title": "apples",
            "children": [{
                "input": {
                    "className": "w3-input w3-border",
                    "id": id_in_variable,
                    "type": "text",
                    "placeholder": "New issue title",
                    "autofocus": true
                }
            }, {
                "textarea": {
                    "className": "w3-input w3-border",
                    "id": "Issues.ID_NEW_ISSUE_DETAILS",
                    "placeholder": "Details (Optional)"
                }
            }, {
                "div": { // options for the issues
                    "className": "w3-dropdown-click margin-top-1em",
                    "children": [{
                        "button": {
                            "id": "Issues.ID_NEW_ISSUE_MILESTONES_BUTTON",
                            "className": "w3-button full-width " + "Milestones.CLASS_BUTTON_NO_MILESTONE",
                            "onclick": "Controls.toggleMilestones()",
                            "children": [{
                                "i": {
                                    "className": "fa fa-map-signs fa-1x",
                                    "aria-hidden": "true"
                                }
                            }]
                        }
                    }, {
                        "div": {
                            "id": "Issues.ID_NEW_ISSUE_MILESTONES_LIST",
                            "className": "w3-dropdown-content w3-bar-block w3-border"
                        }
                    }]
                }
            }, {
                "button": {
                    "onclick": myfunc,
                    "textContent": "click me to call function"
                }
            }]
        }
    };
    const parser = new Parser();
    document.getElementById("test-id").appendChild(parser.json2html(elem));
}

main();