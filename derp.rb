class Derp < Formula
  desc "Natural language grep for regex-challenged developers"
  homepage "https://github.com/syrex1013/derp"
  version "0.1.1"

  if OS.mac?
    url "https://github.com/syrex1013/derp/releases/download/v0.1.1/derp-macos"
    sha256 "8bf7d70c61f4f3accc97ea721bb719fe875ef03165fe810c4bd88d5bf8735e50"
  elsif OS.linux?
    url "https://github.com/syrex1013/derp/releases/download/v0.1.1/derp-linux"
    sha256 "78e05908149f6cfd53276b441b47aef8e21a9a78a29ef91e70a6744f1b94c91e"
  end

  def install
    bin.install "derp-macos" => "derp" if OS.mac?
    bin.install "derp-linux" => "derp" if OS.linux?
  end

  test do
    system "#{bin}/derp", "--version"
  end
end
