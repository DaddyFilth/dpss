# CS-Script Extension Log Output Improvements

## Original Log Output
```
CSS path: <default>
```

## Issues

1. **Ambiguous terminology** — "CSS" is universally recognized as Cascading Style Sheets; should use "C# Script engine path" or "runtime path"
2. **Non-actionable placeholder** — `<default>` provides no resolved path value or context
3. **Missing diagnostic context** — No indication of whether the tool is properly installed or how to configure it
4. **Inconsistent log format** — No standardized prefix for extension log lines

## Improved Log Output (Info Level)

```
[cs-script] Engine path: /home/user/.dotnet/tools/cs-script.cli
[cs-script] Syntaxer path: /home/user/.dotnet/tools/cs-syntaxer
[cs-script] Override engine with "cs-script.enginePath" in settings.json
```

## Error/Warning State (When Tool Missing)

```
[cs-script] Engine path: <not configured> — using default fallback
[cs-script] Fix: dotnet tool install --global cs-script.cli
[cs-script] Syntaxer path: <not configured>
[cs-script] Fix: dotnet tool install --global cs-syntaxer
```

## Recommended Refactorings

1. **Resolve actual path values** — Replace `<default>` with the resolved absolute path to the installed tool
2. **Add actionable hints** — Include one-line instructions on how to override or install missing tools
3. **Use consistent prefix** — All log lines should start with `[cs-script]` for easy filtering
4. **Use appropriate log levels** — Info for normal operation, warning for missing tools, error for critical failures
5. **Separate concerns** — Log engine path and syntaxer path on separate lines for clarity
6. **Add configuration context** — Reference the specific setting key (`cs-script.enginePath`) users should modify

## Example Implementation Pattern

```csharp
// Before
Console.WriteLine("CSS path: <default>");

// After
var enginePath = ResolveEnginePath() ?? "<not configured>";
var logLevel = string.IsNullOrEmpty(ResolveEnginePath()) ? LogLevel.Warning : LogLevel.Info;
_logger.Log(logLevel, "[cs-script] Engine path: {EnginePath}", enginePath);
if (string.IsNullOrEmpty(ResolveEnginePath()))
{
    _logger.LogWarning("[cs-script] Fix: dotnet tool install --global cs-script.cli");
    _logger.LogInformation("[cs-script] Override with \"cs-script.enginePath\" in settings.json");
}