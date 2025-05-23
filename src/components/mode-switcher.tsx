"use client"

import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "./ui/button"

export function ModeSwitcher() {

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    document.documentElement.classList.contains("dark") ?
    document.documentElement.classList.remove("light"):
    document.documentElement.classList.add("light")   
   
  }

  const checkIsDarkSchemePreferred = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
  document.documentElement.classList.add(checkIsDarkSchemePreferred() ? 'dark' : 'light')

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0"
      onClick={toggleTheme}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}