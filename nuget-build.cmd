@echo off

tools\nuget setApiKey <API_KEY> -ConfigFile tools\NuGet.Config
tools\nuget pack summernote.nuspec -version <VERSION> -OutputDirectory build
