# Build Option

> Module: C - Front-End Development / Difficulty: Normal

There is a simple application made with vanilla JavaScript. The application consists of two connected HTML files.

You need to modify vite.config.js to build the application according to the following requirements.

(You can only modify vite.config.js)

(node_modules are provided in a compressed file. Be sure to refer to README.md)

### Build Requirements
- Before building, the source files are located at `/xx_module_a/build_option/source`.
- The build output should work correctly at `/xx_module_a/build_option/app/page1.html` without any additional modifications or commands.
- Both CSS and JS should be correctly imported and built.

> Marking aspect:
- The source files are in the correct location before building. 0.20
- The build output is in the correct location and can be checked through the browser (page1.html). 0.20
- Both JS and CSS files are imported correctly, allowing navigation between page1.html and page2.html. 0.60

> To SCM

The build output location specified in the build requirements should be adjusted to match the server environment.
