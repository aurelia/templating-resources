## Removing custom element injected styles

When you have a style resource associated with a custom element, a style node containing the CSS is injected into the document's `<head>` node. Normally that style node will stay there, even after the custom element is detached from the DOM. Browser support for `as-scoped` and `ShadowDOM` is still thin and thus there is no easy way to remove injected styles again.

[This PR](https://github.com/aurelia/templating-resources/pull/344) is an attempt to address that. The behavior needs to be turned on explicitly in your `main` file where aurelia is configured. This is done by replacing  `au.use.standardConfiguration()` with the following explicit configuration:

```ts
au.use
  .defaultBindingLanguage()
  .history()
  .router()
  .eventAggregator()
  // This also replaces the .standardResources() call
  .plugin(PLATFORM.moduleName('aurelia-templating-resources'), opts => {
    opts.removeInjectedStylesOnBeforeUnbind = true;
  });
```

This will enable the behavior globally. Per-element (or other context) configuration may be considered if there seems to be a demand.

Please note that this should be considered an experimental feature and needs thorough testing before going in production. There may also be performance implications. Should you encounter any issues, feel free to leave a comment [here](https://github.com/aurelia/templating-resources/pull/344).
