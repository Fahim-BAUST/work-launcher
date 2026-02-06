; Custom NSIS installer script for Work Launcher
; Sets up high-priority auto-launch via Task Scheduler with Priority 4

!macro customInstall
  ; Remove old startup shortcut (legacy method)
  Delete "$SMSTARTUP\Work Launcher.lnk"
  
  ; Clean up old registry auto-launch entries (legacy)
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "WorkLauncher"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Work Launcher"
  
  ; Remove any existing Task Scheduler entry
  nsExec::ExecToLog 'schtasks /delete /tn "WorkLauncherStartup" /f'
  
  ; Write PowerShell script to temp file to avoid escaping issues
  FileOpen $0 "$TEMP\wl_setup.ps1" w
  FileWrite $0 '$$exePath = "$INSTDIR\Work Launcher.exe"$\r$\n'
  FileWrite $0 '$$workDir = "$INSTDIR"$\r$\n'
  FileWrite $0 '$$action = New-ScheduledTaskAction -Execute $$exePath -Argument "--startup" -WorkingDirectory $$workDir$\r$\n'
  FileWrite $0 '$$trigger = New-ScheduledTaskTrigger -AtLogOn$\r$\n'
  FileWrite $0 '$$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Priority 4 -ExecutionTimeLimit 0$\r$\n'
  FileWrite $0 '$$principal = New-ScheduledTaskPrincipal -UserId $$env:USERNAME -LogonType Interactive -RunLevel Limited$\r$\n'
  FileWrite $0 'Register-ScheduledTask -TaskName "WorkLauncherStartup" -Action $$action -Trigger $$trigger -Settings $$settings -Principal $$principal -Force$\r$\n'
  FileClose $0
  
  ; Execute PowerShell script (runs elevated from installer context)
  nsExec::ExecToLog 'powershell -ExecutionPolicy Bypass -File "$TEMP\wl_setup.ps1"'
  
  ; Cleanup
  Delete "$TEMP\wl_setup.ps1"
  
  DetailPrint "Work Launcher configured for highest-priority startup"
!macroend

!macro customUnInstall
  ; Remove startup shortcut (legacy)
  Delete "$SMSTARTUP\Work Launcher.lnk"
  
  ; Clean up registry entries (legacy)
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "WorkLauncher"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Work Launcher"
  
  ; Remove Task Scheduler entry
  nsExec::ExecToLog 'schtasks /delete /tn "WorkLauncherStartup" /f'
  
  ; Remove app data
  RMDir /r "$APPDATA\work-launcher"
  
  DetailPrint "Removed all Work Launcher data"
!macroend
