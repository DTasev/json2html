# json2html

Single-file converter from JSON to HTML, like this:

```typescript
const id_in_variable = "my-unique-id";
function myfunc(){
    console.log("I will be called on click!");
}

const template = {
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
                "id": "GreenHornets",
                "placeholder": "Details (Optional)"
            }
        }, {
            "button": {
                "onclick": myfunc,
                "textContent": "click me to call function"
            }
        }]
    }
};

const html: HTMLElement = Parser.parse(template);
const actual_html: string = html.outerHTML;
```

becomes

```HTML
> html.outerHTML
<div class="w3-row w3-dark-grey w3-padding issue-margin-bottom" title="apples">
    <input class="w3-input w3-border" id="apples" type="text" placeholder="New issue title" autofocus="">
    <textarea class="w3-input w3-border" id="GreenHornets" placeholder="Details (Optional)"></textarea>
    <button>click me to call function</button>
</div>
```

# Strange Behaviours
The `"button": {"onclick": myfunc...` bit works, but be ware that in the case of a member function, `this` in the scope of `myfunc` will not refer to its class. For example:
```ts
class MyClass{
    myFunc(){}
}

let mc = new MyClass();

let template = "button": {
"onclick": mc.myFunc // myFunc loses the MyClass scope
}
```

The fix is to wrap the `onclick` with a lambda function like so:

```ts
let template = "button": {
"onclick": () => mc.myFunc()
}
```
For more information: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
# Usage
It can be used to create templates, by specifying certain values in the dictionary with variables:
```ts
function createMyAwesomeLink(custom_title:string):HTMLElement {
    const template = {
        "a": {
            "className": "w3-row w3-dark-grey w3-padding issue-margin-bottom",
            "text": custom_title
    };
    return Parser.json2html(template);
}

// NOTE: The full dictionary is parsed each time!
createMyAwesomeLink("Potatoes") // element's text is Potatoes
createMyAwesomeLink("Apples") // element's text is Apples
```
# Why?
1. I did not like hard-coding the HTML into string, like so:
```ts
const first_div = '<div class="w3-row w3-dark-grey w3-padding issue-margin-bottom" title="apples">';
const input = '<input class="w3-input w3-border" id="apples" type="text" placeholder="New issue title" autofocus="">';
const textarea = '<textarea class="w3-input w3-border" id="GreenHornets" placeholder="Details (Optional)"></textarea>';
const button = '<button onclick="myfunc()">click me to call function</button>';

const html = first_div + input + textarea + button + '</div>';
```

2. I didn't like calling `const elem = document.createElement(...)` and `elem.appendChild(...)` so many times.

3. I was too lazy trying to use a proper library like Angular, React, or any other library that provides templating.

# How efficient is it?
- It uses a bit of recursion that goes as deep as the deepest nested child. Everything else is loops.