## Table of Contents

* [Exmples](#examples)
* [Global Variables](#global-variables)

## Examples

### Optional text

Use square brackets to denote optional text.

```
[What|How] is the [current|] weather
```

The above pattern will match the following sentences

```
What is the weather
What is the current weather
How is the weather
How is the current weather
```

### Define any entity

```
What is the current weather in {location}
```

### Define global entity

```
What is the forecast for {@dayOfWeek}
```

## Global variables

Variable | Description | Values
--- | --- | ---
dayOfWeek | Day of week | Sunday, Monday, Tuesday ...

For full values see ...
