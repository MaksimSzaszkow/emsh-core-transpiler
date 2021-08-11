# Emsh Core Transpiler

Emsh Core Transpiler is concerned with creating valid `.eco` files from valid `.emsh` files. "Core" part of name means that this package will only try to understand functionalities that can be nativly found in other languages, and is meant to be foundation on which other packages will build. Other than converting files to `.eco`, this package in it's initial versions will also contain utility functions meant for navigation across project tree and inside of the transpiled files.

## Meta functionalities

Below is list of things core transpiler can or will be able to (marked with \*) do. Until version 1.0.0 of emsh-core-transpiler, this list can change dramaticly between versions.

### File\*

File abstraction that allows to track what modules are imported, exported or declared inside of the file.

```eco
{
    type: "file",
    name: string,
    imports: Module[],
    contains: Module[],
    exports: Module[]
}
```

### Importing\*

Import `File` variable

```emsh
import "/path/to/module/filename" as y
```

If you want to import specific module (or modules) from file:

```emsh
from "/path/to/module/filename" import x, y
```

Name aliasing is possible:

```emsh
from "/path/to/module/filename" import x, y as a
```

Import statement has no ECO representation as it's contained inside of "imports" property of file.

### Exporting\*

Only modules can be exported, to do so keyword export has to be added to beggining of module declaration:

```emsh
export module x
```

### Module

Main purpose of module is to provide abstraction that creates compatibility layer between languages that work so differently. It consists of scoped classes, functions and variables that either have public keyword next to their declaration or are inside of scope defined block. Inside of given module only one syntax is valid.

```emsh
module ModuleName:
    public class ClassName:
        // class body
    private class className:
        // class body
    class className2:
        // this class is private
    public function FunctionName:
        // function body
    private function functionName:
        // function body
    function FunctionName:
        // this function is private
    public var X
    private var y
    var z // this variable is private
```

```emsh
module ModuleName:
    public:
        class ClassName:
            // class body
        function FunctionName:
            // function body
        var VariableName
    private:
        class className:
            // class body
        function functionName:
            // function body
        var variableName
```

Classes, functions and variables inside of public scope can be accessed after import, private cannot. If no keyword is provided, default is private.

If file contains only one module, declaration of module can be omitted and transpiler will pack everything up by itself into module named "Main" during transpilation.

Emsh provides no way of defining static members at this level as enabling to define functions or variables is sufficient to achive simillar effect.

### Class\*

Class purpose is to provide way of defining blueprint for objects that can be instantieted with keyword `new`. Class can only contain functions and variables. Like with modules, members can be scoped using prefix or by putting them inside scoped block. Both scopes can also use keyword `static` to define functions/variables that exist independantly of any class instance. Inside of given module only one syntax is valid.

```emsh
class ClassName:
    public static function StaticFunction():
    public static var X

    private static function staticFunction():
    private static var Y

    static function staticFunction2(): // this function is private static
    static var Z // this variable is private static

    public function FunctionName():
    public var A

    private function functionName():
    private var B

    function functionName2(): // this function is private
    var C // this variable is privateF
```

```emsh
class ClassName:
    public static:
        class StaticClass:
            // class body
        function StaticFunction:
            // function body
        var StaticVariable
    private static:
        class className:
            // class body
        function functionName:
            // function body
        var variableName
    public:
        class ClassName:
            // class body
        function FunctionName:
            // function body
        var VariableName
    private:
        class className:
            // class body
        function functionName:
            // function body
        var variableName
```

To initialize new object of given class:

```emsh
ClassName x = new ClassName()
```

## Code functionalities

### Function\*

Function purpose is to provide way of packing executable code into reusable format. Functions cannot contain modules or classes. Function consists of `function` keyword, function name and list of arguments it takes. Arugments are variables of any type. Function can also define with return statement return value. If no return value is defined than it will defulat to void.

```emsh
function functionName(var param1,var param2, ...,var paramN):
    // code
    return x // optional
```

Anonymous functions can be created where it makes sense:

```emsh
function (int param1, string param2, ..., char paramN):
    // code
```

Arguments can have default values:

```emsh
function functionName(string param1 = "default", int param2 = 10):
    // code
```

If argument has default value type keyword can be changed to `var`:

```emsh
function functionName(var param1 = "default", var param2 = 10):
    // code
```

Each function has to have unique schema, where schema consists of function name and variable list with their type. Default value on arguments doesnt change schema. This system allows to create functions with same name but different body:

```emsh
// Example of valid definition of 3 functions with same name
function FunctionName(int param1):
    // code
function Functionname(string param1):
    // code
function Functionname(int param1, string param2):
    // code
```

## Loops

Emsh supports for, for...in, for...of, while and do...while loops and also provides syntatic sugar for some of them.

### Times loop (simplified for loop)\*

Syntactic sugar that iterates from 0 to x-1, where x is intiger.

```emsh
x times:
    // code
```

In most languages this will create iteration variable that will default it's name to `i` when not provided. While this variable can be used inside of loop, sometimes to avoid name overlap we need to rename variables, which can be accomplished by defining custom variable name inside of parethesis after `times` keyword:

```emsh
x times (iterVar):
    // iterVar will ba an integer in range 0-(x-1)
```

### For loop\*

Standard for loop that needs iteration variable, condition when to stop and instruction what to do between iterations:

```emsh
for (iterVar, condition, step):
    // code
```

### For...in loop\*

For...in loop iterates over iterable object while giving key or index as first argument and value as second

```emsh
for (key in iterable):
    // code
```

```emsh
for (key, value in iterable):
    // code
```

### For...of loop\*

For...of loop iterates over iterable object while giving value as first arument and key or index as second

```emsh
for value of iterable:
    // code
```

```emsh
for value, key of iterable:
    // code
```

### While loop\*

While loop repeats given code until provided contidion is true

```emsh
while (condition):
    // code
```

### Do...while loop\*

Do...while loop repeats given code until provided condition is true, but always executes code one time, regardless of condition value

```emsh
do:
    // code
while(condition)
```

## Conditional statements

### If\*

If statement will execute provided code only when condition is true

```emsh
if condition:
    // code
```

### Else if\*

Else if statements chains with `if` or `else if` statements if nothing else is betweene `else if` and them. Else if will execute provided code only when previous chained `if` or `else if` statements didnt execute theirs code and provided condition is true

```emsh
if condition:
    // code
else if condition:
    // code
```

### Else\*

Else statements chains with `if` or `else if` statements if nothing else is between `else` and them. Else will execute provided code only when previous chained `if` or `else if` statements didnt execute theirs code.

```emsh
if condition:
    // code
else:
    //code
```

```emsh
if condition:
    // code
else if condition:
    //code
else:
    //code
```

### Display\*

Display statement will try to display result of chosen expression in any available way. It's up to generator to decide how this will be displayed

```emsh
display(expression)
```

### Assigment\*

Assigment assigns value of right side expression to variable on left side:

```emsh
var x = expression
```

### Variable

Variables inside of emsh are static. This is a requirement that might change once fully working version of emsh is released. Emsh core recognizes these types:

#### Primitive types\*

- Integer

```emsh
int x = 1
```

- Double

```emsh
double x = 1.1
```

- Char: defined using single parenthesis

```emsh
char x = 'a'
```

#### Complex types\*

- String: defined using double parenthesis

```emsh
string x = "string"
```

- Array

```emsh
array x = [1, 2, 3]
```

- Object

```emsh
object x = {
    key: value,
    key2: value
}
```

Using keyword `var` instead of type name will infer type based on what value does variable has.

### Reference\*

Asterix (`*`) can be used to imply that variable inside expression is to be used as reference to value, not value. This means that any change to reference will impact referenced value. If variable is used not as a reference, emsh will always copy variable by value, and when variable is used as reference emsh will copy variable by reference, no matter how copying works for given variable type inside of given language. For example, if language copies variable of given type by reference, but inside of emsh asterix wasnt used, it's generators job to ensure that new variable will have assigned to it value, not reference.

### Async/await\*

Soon
