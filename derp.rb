class Derp < Formula
  desc "Natural language grep for regex-challenged developers"
  homepage "https://github.com/syrex1013/derp"
  version "0.1.0"

  if OS.mac?
    url "https://github.com/syrex1013/derp/releases/download/v0.1.0/derp-macos-x64"
    sha256 ""  # Will be calculated after release
  elsif OS.linux?
    url "https://github.com/syrex1013/derp/releases/download/v0.1.0/derp-linux-x64"
    sha256 ""  # Will be calculated after release
  end

  def install
    bin.install "derp-macos-x64" => "derp" if OS.mac?
    bin.install "derp-linux-x64" => "derp" if OS.linux?
  end

  test do
    system "#{bin}/derp", "--version"
  end
end
