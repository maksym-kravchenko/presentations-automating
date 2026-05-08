---
theme: default
title: "{{subject}}"
author: "{{name}}"
date: "{{date}}"
highlighter: shiki
lineNumbers: false
transition: slide-left
mdc: true
---

# {{ $frontmatter.subject }}

{{ $frontmatter.author }} · {{ $frontmatter.company }} · {{ $frontmatter.date }}

---

## Agenda

- Topic one
- Topic two
- Topic three

---

## Section Title

Content goes here.

---

## Thank you

**{{ $frontmatter.name }}**  
{{ $frontmatter.company }}