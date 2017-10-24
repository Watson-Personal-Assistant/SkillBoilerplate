# Intents

This file defines all expertise domain intents.

## Table of Contents

* [Intent Parts](#intent-parts)
* [Weather Current](#weather-current)

## Intent Parts

#### Intent Name

The expertise name should be all in lower case, each word should be separated by dash ('-'). For expertise specific intents it is recommended to use the expertise name or its abbreviation as the first word.

#### Intent Description

Short description of intent.

#### Utterances

Should include examples for intent utterances. Entities should be in curly brackets.
At least one utterance form each sentence type should be added (there is no need to include permutation of the utterance with different entities values).
Full intent utterances can be found in the expertise NLP data files.

#### Entity

Defines entities of the intent which should be extracted by the NLP engine. Entities should be defined as optional or required.

#### Entity Name

Entity name should be all in lower case, each word should be separated by dash('-').

#### Card

Card is an optional metadata response. It can include information that might be used by application to enhance responses, e.g. add link to image etc.

# Weather Current

### Name

weather-current

### Description

The intent returns the current weather for the specified location (or context location). The response includes the current temperature and humidity.

### Utterances

```
What is the weather
What is the current weather
What is the weather in {london}
```

### Entities

* Optional - Entity is not mandatory and will not be used during expertise assignment by the core.

* Required - Entity must exists in user input.

#### Optional

* Location - Name of the city / country
  * Values: any text

#### Required

None.

### Response

#### Text

```
The current weather in london is 25 degrees celsius
```

#### Card

``` json
{
  "url": {
    "current": "http://www.freeiconspng.com/uploads/sun-icon-16.jpg"
  }
}
```
