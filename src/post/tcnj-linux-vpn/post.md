---
title: TCNJ Linux VPN Setup Tutorial
description: A tutorial inspired by the lack of official support for a TCNJ Linux VPN.
tags:
- code
- tcnj
- linux
- vpn
- tutorial
- bash
- commandline
- shell
links: []
timestamp: 06/10/2018
---
If at any point in this tutorial a command fails, install the recommended package using `sudo apt-get install <package name>`, where `<package name>` should be replaced by an actual package name.

## Steps

1. Run the following command to install the libraries required to run the VPN:
   ```sh
   $ sudo apt-get install build-essential gettext autoconf automake libproxy-dev libxml2-dev libtool vpnc-scripts pkg-config \
          libgnutls-dev # libgnutls28-dev on recent Debian/Ubuntu-based distros
   ```

2. Navigate to the directory where you keep installed programs.

3. Run the following commands to install the [OpenConnect](https://github.com/dlenski/openconnect) VPN client extended to support Palo Alto Networks' GlobalProtect VPN. Prefix each command with `sudo` if modifying the current directory requires root privileges:
   ```sh
   $ git clone https://github.com/dlenski/openconnect.git
   $ cd openconnect
   $ git checkout globalprotect
   $ ./autogen.sh
   $ ./configure
   $ make
   $ sudo make install && sudo ldconfig
   ```

4. Create a file named `tcnj-vpn` (no file extension) and write the following code to it using your favorite text editor:
   ```bash
   #!/bin/bash
   sudo /absolute/path/to/where/you/installed/openconnect/openconnect --protocol=gp vpn-gw-ft.tcnj.edu --quiet --user=username
   ```
   `/absolute/path/to/where/you/installed/openconnect` should be replaced by the **absolute** path to the directory where you installed OpenConnect (check using `pwd`) and `username` should be replaced by your TCNJ username.
   
   Note that the additional `openconnect` at the end of the path is intentional. It is the name of the executable in the `openconnect` directory.

5. Run the following command to ensure the file is executable:
   ```sh
   $ chmod u+x tcnj-vpn
   ```

6. Move the file named `tcnj-vpn` to the directory `/usr/bin`. You may be unable to do this using the standard drag-and-drop GUI due to root privileges requirements. In that case run the following command:
   ```sh
   $ sudo mv tcnj-vpn /usr/bin
   ```

## Conclusion

You have successfully configured your TCNJ Linux VPN!

To connect to the VPN simply run the following command from any directory and enter your password when prompted:

```sh
$ tcnj-vpn
```

You may ignore any output unrelated to incorrect credentials.

Note that you will be unable to work from the terminal window where you ran the command so simply open another terminal window if you wish to continue working. Alternatively you could run the command in the background.

To disconnect simply open the terminal window where you ran the `tcnj-vpn` command and press [[CTRL+C]].
