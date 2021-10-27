# Skippet challenge

## Task
Develop a system that will allow users to create and evaluate [Boolean expressions](https://en.wikipedia.org/wiki/Boolean_algebra) based on user-defined values. The system should allow users to create their own boolean variables, from now own referred to as **Args**, and define custom logical operations, from now on referred to as **Operations**, which will be evaluated on-the-fly and presented to end-user, from now on called **User**, every time a system change might happen, ie. an **Arg** or an **Operation** is updated.

### Defining Args
- **Users** will be able to define a list of **Args**.
- **Users** will able to add new **Args** by using an add button (eg. `+ add arg`)
- Each **Arg** will consist of two values, a `name` of type string and a [`truth value`](https://en.wikipedia.org/wiki/Truth_value), which will be user-defined.
- **Users** will be able to change each corresponding **Arg** values.
- Every time an **Arg** value is updated the changes should be reflected in the **Operation**, and the final value should be recalculated.
- The default name value of a new **Arg** should be equal to `newarg${ID}`, where `ID` a unique identifier, and the default value should be equal to `false`.

#### Out of scope
- **Users** will not being able to delete **Args** once their defined.
- We do not cover the case where two arguments have the same name and how the update should be resolved in the **Operation**.

### Defining Operation
- **Users** will be able to define custom **Operation** by combining **Args** or constant truth values with the basic binary operators `and` and `or`. 
- Constant truth values will be indicated by `false` and `true` in the UI of the app.
- The `and` operator is used to represent [conjuction](https://en.wikipedia.org/wiki/Logical_conjunction).
- The `or` operator is used to represent [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction).
- The list of available **Args** will be defined by the user (*see previous section*)
- The **User** should be able to build the required **Operation** by composing basic Boolean operations.
- New basic Boolean operations will be added using a button (eg. `+ add op`)
- The **User** should be able to delete a operation part. (Note: Deletion cannot happen on required operands. In that case just clear the value back to default.)
- The **User** should be able to define nested operations that will be evaluated into a big **Operation**.
- Deleting an operation should also delete all the nested operations.
- When the user add a new operation, the default selected values should be blank and not affect the final result.
- For conjunction and disjunction operations, do not allow users to remove their children if they are only two. These operations need at least two operands to function.
