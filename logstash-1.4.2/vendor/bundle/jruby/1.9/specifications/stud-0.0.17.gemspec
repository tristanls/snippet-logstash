# -*- encoding: utf-8 -*-
# stub: stud 0.0.17 ruby lib lib

Gem::Specification.new do |s|
  s.name = "stud"
  s.version = "0.0.17"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Jordan Sissel"]
  s.date = "2013-06-28"
  s.description = "small reusable bits of code I'm tired of writing over and over. A library form of my software-patterns github repo."
  s.email = "jls@semicomplete.com"
  s.homepage = "https://github.com/jordansissel/ruby-stud"
  s.require_paths = ["lib", "lib"]
  s.rubygems_version = "2.1.9"
  s.summary = "stud - common code techniques"

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<metriks>, [">= 0"])
      s.add_runtime_dependency(%q<ffi>, [">= 0"])
      s.add_development_dependency(%q<rspec>, [">= 0"])
      s.add_development_dependency(%q<insist>, [">= 0"])
    else
      s.add_dependency(%q<metriks>, [">= 0"])
      s.add_dependency(%q<ffi>, [">= 0"])
      s.add_dependency(%q<rspec>, [">= 0"])
      s.add_dependency(%q<insist>, [">= 0"])
    end
  else
    s.add_dependency(%q<metriks>, [">= 0"])
    s.add_dependency(%q<ffi>, [">= 0"])
    s.add_dependency(%q<rspec>, [">= 0"])
    s.add_dependency(%q<insist>, [">= 0"])
  end
end
