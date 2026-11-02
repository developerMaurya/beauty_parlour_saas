# Coding Standards & Conventions

## Code Quality Standards
- Strict ES Modules (`import`/`export`) throughout backend and frontend.
- Standard 2-space indentation, LF line endings, UTF-8 encoding.
- Consistent camelCase for variables and functions, PascalCase for classes, components, and models.
- kebab-case for file and directory names.
- Explicit async/await syntax; no unhandled promise rejections.
- Clean separation of concerns: Controllers only handle HTTP; Services contain business logic; Models define data schemas.
