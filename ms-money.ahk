; This autohotkey script enters transactions, adds and removes flags in the antiquated accounting software we use :-/
;
; Start each sequence with the category field selected
; while entering a new transaction, or modifiying an
; existing one.
;
; Money Plus Sunset Deluxe: [https://www.microsoft.com/en-us/download/details.aspx?id=20738]
; Chrome Extension: [https://github.com/StAmourD/money-tools-chrome]

; CTRL+Enter: add flag to a new entry
; CTRL+ALT+Enter: removes flag from an existing entry
; CTRL+DOWN: Navigates to category from account entry list
; CTRL+ALT+Space: remove flags from modified entry from category screen
; CTRL+ALT+RButton: reload this script

#Persistent
return

;;;
; TEST
!a::
	ShowGUI("12/13/82", "a description goes here", 3.45)
return
; TEST END
;;;

iEnterTransaction(Date, Description, Amount) {
	;ShowGUI(Date, Description, Amount)

	ToolTip Entering transaction %Description%
	EnterTransaction(Date, Description, Amount)
	SetTimer, ClearToast, 4500
	return
}

ClearToast:
	ToolTip
return

EnterTransaction(Date, Description, Amount) {
	SetTitleMatchMode, 3
	WinActivate, ahk_class MSMoney Frame
	;Send {Tab}
	Send !w
	Sleep, 200
	ControlFocus, ClassRegEdit1
	Sleep, 200
	Send {Tab}
	Sleep, 200
	SendInput {Raw}%Date%
	;SendInput {Raw}3/22/2018
	Sleep, 200
	Send {Tab}
	Sleep, 200
	Send {Tab}
	Sleep, 200
	Send {Tab}
	Sleep, 200
	SendInput {Raw}%Amount%
	Sleep, 200
	Send +{Tab}
	Sleep, 200
	Send +{Tab}
	;Sleep, 200
	return
}

OnClipboardChange:
	if (A_EventInfo = 1) {
		FoundPos := InStr(clipboard, "FromTable|")
		if (FoundPos = 1) {
			; TODO split on the pipes |
			; do other that tooltip for display
			; create functions to manipulate MSMoney
			RowValues := StrSplit(clipboard, "|")

			date := RowValues[2]
			description := RowValues[3]
			amount := RowValues[4]
			balance := RowValues[5]

			iEnterTransaction(date, description, amount)

			;ToPrint := date . " " . amount

			;ToolTip %ToPrint%
			;; use SetTimer instead of sleep for async like feel
			;Sleep 2500
			;ToolTip  ; Turn off the tip.

		}
	}
return

;;;
; GUI logic
ShowGUI(Date, Description, Amount) {
	Gui,Add,Text,x10 y0 w60 h13,Date
	Gui,Add,Text,x140 y0 w50 h13,Amount
	Gui,Add,Edit,x10 y20 w120 h21, % Date
	Gui,Add,Edit,x140 y20 w120 h21, % Amount
	Gui,Add,Edit,x10 y50 w250 h63, % Description
	Gui,Add,Button,x130 y120 w60 h23 gEnterGUI,Enter
	Gui,Add,Button,x200 y120 w60 h23 gCloseGUI,Cancel
	Gui,Show,w300 h175,RowData
	return
}

EnterGUI:
	Gui, Hide
	Gui, Destroy
return

CloseGUI:
	Gui, Destroy
return
; GUI logic END
;;;

; keystrokes to removes flag from an existing entry
; CTRL+ALT+Enter
^!Enter::
	Send {Tab}
	Sleep, 200
	Send {Enter}
	Sleep, 200
	Send {Esc}
	Sleep, 200
	Send {Up}
	Sleep, 200
	Send, {AppsKey}
	Sleep, 400
	Send o
	Sleep, 200
	Send {Space}
	Sleep, 200
	Send {Enter}
Return

; keystrokes to add flag to a new entry
; CTRL+Enter
^Enter::
	Send {Tab}
	Sleep, 200
	Send, {AppsKey}
	Sleep, 400
	Send o
	Sleep, 200
	Send {Enter}
	Sleep, 200
	Send {Enter}
Return

; Navigates to category from account entry list
; CTRL+DOWN
^Down::
	Send {Enter}
	Sleep, 200
	Send {Tab}
	Sleep, 200
	Send {Tab}
	Sleep, 200
	Send {Tab}
	Sleep, 200
	Send {Tab}
	Sleep, 200
Return

; keystrokes to remove flags from modified entry from category screen
; CTRL+ALT+Space
^!Space::
	Send {Tab}
	Sleep, 200
	Send {Enter}
	Sleep, 200
	Send {Up}
	Sleep, 200
	Send, {AppsKey}
	Sleep, 400
	Send o
	Sleep, 200
	Send {Space}
	Sleep, 200
	Send {Enter}
Return

; reload this script
; CTRL+ALT+RButton
^!RButton::
	ToolTip Reloading...
	Sleep 500
	Reload
Return
