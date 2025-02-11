/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/MealPlanner`; params?: Router.UnknownInputParams; } | { pathname: `/navigation`; params?: Router.UnknownInputParams; } | { pathname: `/PantryView`; params?: Router.UnknownInputParams; } | { pathname: `/RecipeDetail`; params?: Router.UnknownInputParams; } | { pathname: `/ViewRecipes`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/MealPlanner`; params?: Router.UnknownOutputParams; } | { pathname: `/navigation`; params?: Router.UnknownOutputParams; } | { pathname: `/PantryView`; params?: Router.UnknownOutputParams; } | { pathname: `/RecipeDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/ViewRecipes`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/MealPlanner${`?${string}` | `#${string}` | ''}` | `/navigation${`?${string}` | `#${string}` | ''}` | `/PantryView${`?${string}` | `#${string}` | ''}` | `/RecipeDetail${`?${string}` | `#${string}` | ''}` | `/ViewRecipes${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/MealPlanner`; params?: Router.UnknownInputParams; } | { pathname: `/navigation`; params?: Router.UnknownInputParams; } | { pathname: `/PantryView`; params?: Router.UnknownInputParams; } | { pathname: `/RecipeDetail`; params?: Router.UnknownInputParams; } | { pathname: `/ViewRecipes`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
