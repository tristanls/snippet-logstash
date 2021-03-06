# -*- encoding: utf-8 -*-
# stub: jls-grok 0.10.12 ruby lib lib

Gem::Specification.new do |s|
  s.name = "jls-grok"
  s.version = "0.10.12"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Jordan Sissel", "Pete Fritchman"]
  s.date = "2013-10-07"
  s.description = "Grok ruby bindings - pattern match/extraction tool"
  s.email = ["jls@semicomplete.com", "petef@databits.net"]
  s.homepage = "http://code.google.com/p/semicomplete/wiki/Grok"
  s.require_paths = ["lib", "lib"]
  s.rubygems_version = "2.1.9"
  s.summary = "grok bindings for ruby"

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<cabin>, [">= 0.6.0"])
    else
      s.add_dependency(%q<cabin>, [">= 0.6.0"])
    end
  else
    s.add_dependency(%q<cabin>, [">= 0.6.0"])
  end
end
