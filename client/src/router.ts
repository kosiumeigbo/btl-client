interface Route {
  path: string;
  view: string;
}

const navigateTo = (url: string): void => {
  history.pushState(null, "", url);
  router();
};

const router = async (): Promise<undefined> => {
  const routes: Route[] = [
    {
      path: "/",
      view: "<home-page></home-page>"
    },
    {
      path: "/search",
      view: "<search-page></search-page>"
    },
    {
      path: "/library",
      view: "<library-page></library-page>"
    },
    {
      path: "/sub-library",
      view: "<sub-lib-page></sub-lib-page>"
    },
    {
      path: "/book",
      view: "<book-page></book-page>"
    }
  ];

  const errorRoute: Route = {
    path: "/404",
    view: "<h1>404 Not Found</h1>"
  };

  const checkMatches = routes.map((route) => {
    return {
      route,
      isMatch: location.pathname === route.path // returns a boolean value
    };
  });

  let match = checkMatches.find((checkMatch) => checkMatch.isMatch);

  if (match === null || match === undefined) {
    match = {
      route: errorRoute,
      isMatch: true
    };
  }

  const root = document.querySelector("#root");

  if (root !== null) {
    root.innerHTML = match.route.view;
  }
};

window.addEventListener("popstate", (e) => {
  router();
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e: Event) => {
    const navLink: HTMLAnchorElement | null = (e.target as HTMLElement)?.closest("[data-link]");
    if (navLink !== null && navLink !== undefined && navLink.hasAttribute("href")) {
      e.preventDefault();
      navigateTo(navLink.href);
    }
  });

  router();
});
