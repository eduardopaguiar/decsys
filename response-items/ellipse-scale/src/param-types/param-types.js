// Types and their constructors

// TODO: YARN2 workspace:* ?
/**
 * standard options:
 * { path, label, defaultValue, info }
 *
 *
 * string
 * options: { limit } // TODO: `required` option?
 *
 * "string"
 * ["string", label, default = "", options{}]
 * string(label, default = "", options{})
 * {
 *   type: "string",
 *   ...standard options,
 *   ...string options
 * }
 *
 * "string?"
 * ["string?", label, default, options{}] // this one is a bit dumb, if you want string? with options. but tough.
 * stringUndefined(label, options{})
 * - no object constructor as these are just shortcuts for string which don't set defaultValue
 *
 *
 * number
 * options: { min, max }
 *
 * "number"
 * ["number", label, default = 0, options{}]
 * number(label, default = 0, options{})
 * {
 *   type: "number",
 *   ...standard options
 *   defaultValue: 0,
 *     // at this time undefined defaultValue on number types are coerced to 0 in the editor,
 *     // so behaviour in reponse items should reflect this.
 *     // TODO :warn
 *   ...number options
 * }
 *
 *
 * bool
 *
 * "bool"
 * ["bool", label, default]
 * bool(label, default)
 * {
 *   type: "bool",
 *   ...standard options
 * }
 *
 *
 * oneOf
 * options: { oneOf }
 *
 * - no string constructor due to required options
 * ["oneOf", label, default, oneOf[] | options{}]
 * oneOf(label, default, oneOf[] | options{})
 * {
 *   type: "oneOf",
 *   ...standard options
 *   defaultValue: MUST be one of the `oneOf` items specified
 *     // If defaultValue is not one of the valid `oneOf` items
 *     // the editor will coerce it to the first item in the `oneOf` array.
 *     // response item behaviour should reflect this.
 *     // TODO: warn
 *   ...options,
 *   oneOf: [] // MUST be an array. Fewer than 2 items is valid, but effectively pointless.
 *     // TODO: we could coerce this to an array, I guess?
 * }
 *
 *
 * array
 * options: { childType, limit }
 *
 * - no string constructor due to required options
 * ["array", label, childType, options{}]
 * array(label, childType, options{})
 * {
 *   type: "array",
 *   ...standard options
 *     // Note that `defaultValue` is unused
 *   ...options,
 *   childType:
 *     // MUST be another ParamType definition
 *     // Note that `path` on the direct childType will be ignored
 * }
 *
 *
 * logical groupings used by the UI
 * group
 * options: { paramTypes, flatPaths }
 *
 * - no string constructor due to children
 * ["group", label, null, options{}] // technically works, but not the simplest due to lack of `defaultValue`
 * group(label, options{})
 * {
 *   // object shorthand
 *   ...child paramTypes
 * }
 * {
 *   type: "group",
 *   ...standard params
 *     // Note that `defaultValue` is unused
 *   ...options
 * }
 *
 *
 * section
 * options { paramTypes } // defines child params
 *
 * - no string constructor due to children
 * ["section", label, null, options{}] // technically works
 * section(label, paramTypes{})
 * {
 *   type: "section",
 *   label,
 *   paramTypes
 * }
 */

// need an object validator, and possibly track validation state through the helpers internally in the platform
// what validates? just the editor? or component loading?
// standalone validator? to go with story/docs checker?

// - errors and warnings:
// - number 0 coercion
//

// need to convert to propTypes, defaultProps
