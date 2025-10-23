class Derp < Formula
  desc "Natural language grep for regex-challenged developers"
  homepage "https://github.com/syrex1013/derp"
  version "0.1.0"

  if OS.mac?
    url "https://github.com/syrex1013/derp/releases/download/v0.1.0/derp-macos-x64"
    sha256 "7c6707637aeb813308d0d53b6ce0a246ce5504684713d21f42be05c6643c557e"
  elsif OS.linux?
    url "https://github.com/syrex1013/derp/releases/download/v0.1.0/derp-linux-x64"
    sha256 "593b7fec61320020974bb93b9f57a6926ed20ac36a47ce0d1e94fd01971b0405"
  end

  def install
    bin.install "derp-macos-x64" => "derp" if OS.mac?
    bin.install "derp-linux-x64" => "derp" if OS.linux?
  end

  test do
    system "#{bin}/derp", "--version"
  end
end
