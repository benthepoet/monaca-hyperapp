// NPM modules
const ons = require('onsenui');
const { app, h } = require('hyperapp');

// Onsen UI Stylesheets
require('onsenui/css/onsen-css-components.min.css');
require('onsenui/css/onsenui.css');

app({
    actions: {
        popPage: ({ pages }, actions, { ref }) => {
            return update => {
                const fn = () => {
                    return new Promise((resolve) => {
                        update({
                            pages: pages.slice(0, pages.length - 1)
                        });
                        resolve();
                    });  
                };
                
                ref._popPage({}, fn);
            };
        },
        pushPage: ({ pages }, actions, { ref, page }) => {
            console.log(ref);
            return update => {
                const fn = () => {
                    return new Promise((resolve) => {
                        update({
                            pages: pages.concat([page])
                        });
                        requestAnimationFrame(resolve);
                    });  
                };
                
                ref._pushPage({}, fn);
            };
        }
    },
    state: {
        pages: [Main]
    },
    view: (state, { popPage, pushPage }) => {
        let ref;
        
        const setRef = (element) => { ref = element; };
        
        const pages = state.pages.map((page) => {
            return page({ 
                popPage: () => {
                    popPage({ ref });
                },
                pushPage: (options) => {
                    pushPage(Object.assign({}, options, { ref }));
                }
            });
        });
        
        return (
            <ons-navigator oncreate={setRef} onupdate={setRef}>
                {pages}
            </ons-navigator>
        );
    }
});

function Page({ title }, children) {
    return (
        <ons-page>
            <ons-toolbar>
                <div class="center">
                    {title}
                </div>
            </ons-toolbar>
            <div></div>
            <div class="content">
                {children}
            </div>
        </ons-page>
    );
}

function Main({ pushPage }) {
    return (
        <Page title="Main Page">
            <ons-input modifier="underbar" type="text" />
            <ons-button onclick={() => pushPage({ page: Second })}>Push Page</ons-button>
        </Page>
    );
}

function Second({ popPage }) {
    return (
        <Page title="Second Page">
            <p>Second Page</p>
            <ons-button onclick={popPage}>Pop Page</ons-button>
        </Page>
    );
}