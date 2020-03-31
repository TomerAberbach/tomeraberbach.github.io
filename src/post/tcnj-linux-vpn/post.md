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

1. Run the following command to install the library required to run the VPN:
   ```sh
   $ sudo apt-get install openconnect
   ```

2. Create a file named `tcnj-vpn` (no file extension) and write the following code to it using your favorite text editor:
   ```bash
   #!/bin/bash
   sudo openconnect --protocol=gp vpn-gw-ft.tcnj.edu --quiet --user=username
   ```
   `username` should be replaced by your TCNJ username.

3. Run the following command to ensure the file is executable:
   ```sh
   $ chmod u+x tcnj-vpn
   ```

4. Move the file named `tcnj-vpn` to the directory `/usr/bin`. You may be unable to do this using the standard drag-and-drop GUI due to root privileges requirements. In that case run the following command:
   ```sh
   $ sudo mv tcnj-vpn /usr/bin
   ```

5. Set up [multifactor authentication with Duo](https://security.tcnj.edu/resources-tips/duo-multifactor-authentication) (TCNJ requires it).

## Conclusion

You have successfully configured your TCNJ Linux VPN!

To connect to the VPN simply run the following command from any directory, enter your password when prompted, and authenticate via the device you set up with Duo:

```sh
$ tcnj-vpn
```

You may ignore any output unrelated to incorrect credentials.

Note that you will be unable to work from the terminal window where you ran the command so simply open another terminal window if you wish to continue working. Alternatively you could run the command in the background.

To disconnect simply open the terminal window where you ran the `tcnj-vpn` command and press [[CTRL+C]].
