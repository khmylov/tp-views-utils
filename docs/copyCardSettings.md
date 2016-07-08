# Copy settings usecase

This usecase allows users to batch apply settings of one view to a set of other views.

What can be copied:

  - Card customizations
  - Visual encoding

## Details
Authenticated user opens the page for this action.  
He sees a tree of all views he has access to.

  - User can filter items in this tree by view name
  - The tree displays a view name, its type and/or view mode (board, list, dashboard, etc.), and access level (private, shared, public)


User chooses a view (called Source).  
The page displays information about the chosen view.


User chooses what he wants to copy from this view.  
Possible options are (user has to select at least 1 of them to proceed):

  - Card customizations
  - Visual encoding


For every option, there is a validation of the Source view.  
If the settings associated with some option can't be copied, or there are possible issues, an error and/or warning panel is displayed with information.


User chooses at least 1 view to copy the settings to (called Targets).  
User can copy settings from Source to Target only when:

  - User has access rights to edit the Target view
  - Source and Target have the same type AND view mode (for example, it's not possible to copy settings from board to timeline)
  - Both source and Target have the same set of card types selected
  - Boards, timelines, and one-by-one views can have any X and Y axes configurations because their "cards" can't be customized yet
  - The lists can have different X and Y axes selected, but the user should be warned about that
