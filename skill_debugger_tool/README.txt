

---------------------------------------- Skill Debugger Tool ---------------------------------------------------

The Skill Debugger Tool is a standalone app that can be used to converse with your skill when your are running
it locally, it handles all requests to the skill and manages the context.


-- Usage --

1. Run your skill (using npm start)
2. Open the Skill Debugger Tool file according to your operating system
3. Make sure the skill url is set to the correct url
  3.1 The default skill url is http://localhost:10011
  3.2 If you would like to change the url go to File -> Skill url
4. If your skill uses authentication make sure to add the skill key, go to File -> Skill key
5. In the Converse request box enter your request
  5.1 If you would like to add/change context for your request you can do so in the Context box
6. Click Submit request to send your request to the skill
7. See the result
  7.1 You can toggle between the Converse response and the Evaluation response
  7.2 The context will be updated automatically
  7.3 All previous requests are shown in the Previous requests box - the Previous requests list can be cleared,
      just go to File -> Clear previous requests