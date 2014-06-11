library(shiny)
library(maps)
library(mapdata)
library(rworldmap)
library(gridExtra)
library(mapproj)
source("./mapfuncs.R")

# define global data store for persistent storage
locationtable <- data.frame(Nym=character(),
                            Contact=character(),
                            Latitude=numeric(),
                            Longitude=numeric(),
                            Radius=numeric())

set.seed(seed = 646468449*runif(1))

shinyServer(function(input, output, session) {
    # Reactive dependencies
    myReact <- reactiveValues()
    buttonClicked <- reactive(input$paintupdate)
    make.noise <- reactive({
      if(buttonClicked() > 0) {
        # Every time the update button is clicked, we draw another noise pair
        # We use two uniform variables to generate the signs for a laplace 
        # distribution.
        x.sign <- sign(runif(1,min=-1,max=1))
        y.sign <- sign(runif(1,min=-1,max=1))
        # The shift created by the noise is bounded by the radius.
        # This ensures the app never really "lies".
        x.jitter <- x.sign*min(rexp(1,rate=1/input$noisepow),input$radius) *
          sqrt(2)/2
        y.jitter <- y.sign*min(rexp(1,rate=1/input$noisepow),input$radius) *
          sqrt(2)/2
        print(x.jitter)
        print(y.jitter)
        print(buttonClicked())
        return(data.frame(x.jitter = x.jitter, y.jitter = y.jitter))
      }
    })
        
    #  Map plot
    #  1) It is "reactive" and therefore should be automatically 
    #     re-executed when inputs change
    #  2) Its output type is a plot 
    #
    theworld <- function() {
      isolate({
        par(mar = rep(0,4))
        map("world2", projection="vandergrinten", wrap=TRUE, 
            resolution=2, mar = rep(0,4),
            bg=rgb(210, 200, 176,alpha=255,maxColorValue = 255))
      })      
    }
    
    user.circle <- function(coords,col) {
        cur.circ <- circleFun(c(coords$x,coords$y),
                              radius=input$radius, npoints = 30)
        polygon(x= cur.circ$x,
                y= cur.circ$y,
                col = col)

        if("plotclick" %in% names(input)) {
          text(labels=input$name,x=coords$x,y=coords$y,
               vfont=c("sans serif","plain"), 
               cex=10*log(input$radius*5))
        }
    }
    observe({
      if (buttonClicked() > 0) {
        
        new.noise <- make.noise()
        noisy.coords <- data.frame(x = input$plotclick$x+new.noise$x.jitter,
                                   y = input$plotclick$y+new.noise$y.jitter)
        
        myReact$poly <- 
          c(isolate(myReact$poly), 
            list(list(coords = noisy.coords,
            col = 
              isolate(rainbow(1000,s=0.5,alpha=0.5)[input$circlecolor]))))
        
    }
  })
    
    output$myworld <- renderPlot({
      theworld()
      for (circ.ind in seq_along(myReact$poly)) {
          do.call(user.circle, myReact$poly[[circ.ind]])
      }
    }, height = 640)

    output$clickcoord <- renderPrint({
        # get user clicks, report coords
        if ("plotclick" %in% names(input)) {
            print(input$plotclick)
        }
    })
    
    output$noisycoord <- renderPrint({
        if ("plotclick" %in% names(input)) {
            print(make.noise())
        }
    })

    reactive({
      if (input$submitinfo > 0) {
          new.noise <- make.noise()
          locationtable <<- 
            rbind(locationtable,
                  data.frame(Nym=input$name,
                             Contact=input$contact,
                             Longitude=input$plotclick$x+new.noise$x.jitter,
                             Latitude=input$plotclick$y+new.noise$y.jitter,
                             Radius=input$radius))
      }
    })

    output$locationtable <- renderTable({
      # if (is.null(locationtable)) {return()}
      new.noise <- make.noise()
      locationtable
      if (input$submitinfo > 0) {
        locationtable <<- 
          rbind(locationtable,
                data.frame(Nym=input$name,
                           Contact=input$contact,
                           Longitude=input$plotclick$x+new.noise$x.jitter,
                           Latitude=input$plotclick$y+new.noise$y.jitter,
                           Radius=input$radius))
      }
      print(locationtable)
      }, 'include.rownames' = FALSE
       , 'include.colnames' = TRUE
       , 'sanitize.text.function' = function(x){x}
    )

    output$saveinfo <- downloadHandler(
      filename = function() {
          paste('fuzzytable-', Sys.Date(), '.csv', sep="")
      },
      content = function(file) {
        write.csv(locationtable, file)
      })

    output$savemap <- downloadHandler(
      filename = function() {
          paste('fuzzymap-', Sys.Date(), '.png', sep="")
      },
      content = function(file) { 
# function to actually write the image file
# http://stackoverflow.com/questions/14810409/save-plots-made-in-a-shiny-app?rq=1
          png(file)
          theworld()
          dev.off()
          contentType = 'image/png'
      })

})
