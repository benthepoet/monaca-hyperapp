// NPM modules
const ons = require('onsenui');
const { app, h } = require('hyperapp');

// Onsen UI Stylesheets
require('onsenui/css/onsen-css-components.min.css');
require('onsenui/css/onsenui.css');

app({
    actions: {
        popPage: ({ pages }, actions, { navigator }) => {
            return update => {
                const fn = () => {
                    return new Promise((resolve) => {
                        update({
                            pages: pages.slice(0, pages.length - 1)
                        });
                        resolve();
                    });  
                };
                
                navigator()._popPage({}, fn);
            };
        },
        pushPage: ({ pages }, actions, { navigator, page }) => {
            return update => {
                const fn = () => {
                    return new Promise((resolve) => {
                        update({
                            pages: pages.concat([page])
                        });
                        requestAnimationFrame(resolve);
                    });  
                };
                
                navigator()._pushPage({}, fn);
            };
        }
    },
    state: {
        pages: [Main]
    },
    view: (state, { popPage, pushPage }) => {
        return (
            <Navigator pages={state.pages} popPage={popPage} pushPage={pushPage}>
            </Navigator>
        );
    }
});

function Navigator(props, children) {
    const { pages, ...pageProps } = props;
    pageProps.navigator = observable();
    
    return (
        <ons-navigator oncreate={pageProps.navigator} onupdate={pageProps.navigator}>
            {pages.map((page) => page(pageProps) )}
        </ons-navigator>
    );
}

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

function Main({ navigator, pushPage }) {
    return (
        <Page title="Main Page">
            <ons-input modifier="underbar" placeholder="username" type="text" />
            <ons-button onclick={() => pushPage({ navigator, page: Second })}>Push Page</ons-button>
        </Page>
    );
}

function Second({ navigator, popPage }) {
    return (
        <Page title="Second Page">
            <p>Second Page</p>
            <ons-button onclick={() => popPage({ navigator }) }>Pop Page</ons-button>
        </Page>
    );
}

function observable(value) {
    let _value = value;
    
    return (change) => {
        if (change !== undefined) {
            _value = change;
        }
        return _value;
    };
}