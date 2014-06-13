library(shiny)
library(markdown)

# Define UI for application
shinyUI(pageWithSidebar(

  # Application title
  headerPanel("Fuzzy Locator",
              list(tags$head(tags$style("body {background-color: #100000; }
                                        h1 {color: #FFFFFF; }")))),

  # Sidebar with grabbers to control circle, and textboxes for info
  sidebarPanel(
    sliderInput("radius", 
                "Location radius", 
                min = 0,
                max = 1, 
                value = 0.1,
                round=FALSE,
                step=0.001),
    sliderInput("noisepow",
                "Jitter (exponential) power",
                min=0,
                max=1,
                value=0.1),
    sliderInput("circlecolor",
                "Circle color (hue)",
                min=0,
                max=1000,
                step=1,
                value=sample(1:1000,1)),
    actionButton("paintupdate", "Nudge Circle"),
        textInput("name","Nym"),
        textInput("contact","Contact"),
        actionButton("submitinfo","Submit Location + Info"),
    downloadButton("savemap", label="Download Map"),
    downloadButton("saveinfo", label="Download Info"),
    textOutput("clickcoord"),
    textOutput("noisycoord")
  ),

  # Panels
  mainPanel(
      tabsetPanel("tabpanel",
          tabPanel("Map",
                   plotOutput("myworld", height="650px",width="750px",
                              clickId="plotclick"),
                   tags$head(
                     tags$style("#\"Map\" {padding-bottom: 2cm; }")
                   )
                   ),
          tabPanel("List",
                   tableOutput("locationtable"),
                   tags$head(
                     tags$style("#locationtable {background-color: white; }",
                                media="screen", type="text/css")
                   )
                   )
      ),
      wellPanel(
        includeMarkdown('../readme.md')
      )
  )
))