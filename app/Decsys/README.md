# ✅ DECSYS Survey Platform

The DECSYS Survey Platform aims to be a flexible cross-platform web-based survey platform that particularly makes it easy to load custom question response components.

It is used to showcase the DECSYS Ellipse Rating Scale.

# 🏃‍♀️ Running the Survey Platform

- For Windows 7+ (64-bit)
  1. Download a `win-x64` asset from **Releases**
  1. Extract it to a folder
  1. Double-click `Run Decsys`
  1. Open a web browser and navigate to `localhost`
- For other OSes
  1. Have the .NET Core runtime for your OS. (version `3.1` or newer)
  1. Download a `dotnet-3.1` asset from **Releases**
  1. Extract it to a folder
  1. Run the application as follows:
     - Use the provided `run-decsys` or `Run Decsys (Windows)` script
     - Use the `dotnet` CLI
       - Navigate inside the `Decsys/` folder
       - run `dotnet decsys.dll`
       - Optionally pass server urls argument to specify a port, otherwise `5000` will be used.
         - e.g. `dotnet decsys.dll --server.urls http://0.0.0.0:80`
  1. Open a web browser and navigate to `localhost`

## Running as a service

When hosting Decsys on a remote server, you may want to install it as a service, if you don't put it behind a reverse proxy.

For Windows, we recommend using [NSSM](https://nssm.cc/) to do so.

### Troubleshooting

- Mostly just ensure nothing else is bound to port `80` on your network interfaces.
  - Or edit the launch script to change the port / specify a port when using the `dotnet` CLI

# 🏗 Building the Survey Platform

## Prerequisites

- `dotnet` SDK `3.1` or newer
  - either independently or part of Visual Studio 2019 or newer
- node.js `10.x` or newer (including `npm`)

## Build steps

1. Clone this repository
1. Optionally get some [Response Components](https://github.com/search?q=org%3Adecsys+component+in%3Aname+archived%3Afalse) and put them in `app/Decsys/components/`
1. For development:

- In Visual Studio:
  1. Open `Decsys.sln`
  1. Build / Run
- on the command line:
  1. Install top level javascript dependencies
     - `npm i` **in the repository root**.
  1. Install local javascript dependencies
     - `npm i` **in `app/client-app`**
  1. Build the application
     - `dotnet build` **in `app/Decsys`**

1. For publishing:
1. Complete the development steps above
1. On the command line:
   1. `npm run build` **in `app/client-app`**
   1. Copy `app/client-app/build/*` to `app/Decsys/ClientApp`
   1. `dotnet publish -c release` **in `app/Decsys`**
   1. The publish output can be distributed
      - optionally with supporting bootstrap scripts from `app/scripts`.