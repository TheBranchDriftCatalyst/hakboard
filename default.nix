{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "nextjs-app";
  src = pkgs.lib.cleanSource ./.;

  buildInputs = [ pkgs.nodejs pkgs.yarn pkgs.cacert ];

  # Set environment variables for Yarn and SSL certificates
  buildPhase = ''
    export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
    export YARN_CACHE_FOLDER=$(mktemp -d)
    export HOME=$PWD
    yarn install
    yarn build
  '';

  installPhase = ''
    mkdir -p $out
    cp -r .next $out/.next
    cp -r node_modules $out/node_modules
    cp -r public $out/public
    cp package.json $out/package.json
  '';

  meta = {
    description = "A Next.js application";
    maintainers = [ pkgs.lib.maintainers.example ];
  };
}
