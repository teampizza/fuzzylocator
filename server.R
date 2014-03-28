library(shiny)
library(maps)
library(mapdata)
library(ggplot2)
library(ggthemes)
library(rworldmap)
library(gridExtra)
source("./mapfuncs.R")

# define global data store for persistent storage
locationtable <- data.frame(Nym=character(),
                            Contact=character(),
                            Latitude=numeric(),
                            Longitude=numeric(),
                            Radius=numeric())

shinyServer(function(input, output) {

    #  1) It is "reactive" and therefore should be automatically 
    #     re-executed when inputs change
    #  2) Its output type is a plot 
    #
    output$myworld <- renderPlot({
        # Reactive dependencies
        input$paintupdate
        # Every time the update button is clicked, we draw another noise pair
        # We use two uniform variables to generate the signs for a laplace distribution.
        x.sign <- sign(runif(1,min=-1,max=1))
        y.sign <- sign(runif(1,min=-1,max=1))
        x.jitter <- x.sign*min(rexp(1,rate=1/input$noisepow),input$radius)*sqrt(2)/2
        y.jitter <- y.sign*min(rexp(1,rate=1/input$noisepow),input$radius)*sqrt(2)/2
        
        # generate an rnorm distribution and plot it
        # dist <- rexp(input$obs)


        # world <- map_data("world")
        # worldmap <- ggplot(aes(x = long, y = lat, group = group), data = world) +
        #    geom_path() # +
        # coord_map("vandergrinten")

        # Builds offset map
        # mp1 <- fortify(map(fill=TRUE, plot=FALSE))
        # mp2 <- mp1
        # mp2$long <- mp2$long + 360
        # mp2$group <- mp2$group + max(mp2$group) + 1
        # mp <- rbind(mp1, mp2)
        # worldmap <- ggplot(aes(x = long, y = lat, group = group), data = mp) + 
        #     # geom_polygon() +
        #     geom_path() + # colour="grey") +
        #     scale_x_continuous(limits = c(-26, 334)) + # sets the longitudinal center
        #     # coord_map("cylequalarea",lat0=90)
        #     # coord_map("vandergrinten") +
        #     # scale_y_reverse() + 
        #     theme_solarized(light=TRUE)


        # if ("plotclick" %in% names(input)) {
        #cur.circ <- circleFun(input$plotclick,100,npoints = 100)
        #worldmap <- worldmap +
        #    annotate("path",
        # x=input$plotclick$x+10*cos(seq(0,2*pi,length.out=100)),
        # y=input$plotclick$y+10*sin(seq(0,2*pi,length.out=100)))
        # geom_polygon(aes(cur.circ$x, cur.circ$y), data = df, inherit.aes = F)
        #}
        
        # print(worldmap)
        isolate(map("world2", projection="vandergrinten", wrap=TRUE, resolution=2,
            bg=rgb(210, 200, 176,alpha=255,maxColorValue = 255)))

        # worldmap <- ggplot(aes(x = mapdata$x, y = mapdata$y)) + geom_path()
        # print(worldmap)

        
        isolate({
            # The shift created by the noise is bounded by the radius.
            # This ensures the app never really "lies".
            noisycenter <- c(input$plotclick$x+x.jitter,
                             input$plotclick$y+y.jitter)
            cur.circ <- circleFun(noisycenter,
                                  radius=input$radius, npoints = 30)
            
            polygon(x=cur.circ$x,y=cur.circ$y,col = rainbow(1000,s=0.5,alpha=0.5)[input$circlecolor])
            if("plotclick" %in% names(input)) {
                text(labels=input$name,x=noisycenter[1],y=noisycenter[2],
                     vfont=c("sans serif","plain"), cex=10*log(input$radius*5))
            }
        })
        
    })

    output$clickcoord <- renderPrint({
        # get user clicks, report coords
        if ("plotclick" %in% names(input)) {
            print(input$plotclick)
        }
    })

    reactive({
        if (input$submitinfo > 0) {
            locationtable <<- rbind(locationtable,
                                   data.frame(Nym=input$name,
                                              Contact=input$contact,
                                              Longitude=input$plotclick$x,
                                              Latitude=input$plotclick$y,
                                              Radius=input$radius))
        }
    })

    output$locationtable <- renderTable({
        # if (is.null(locationtable)) {return()}
        locationtable
        if (input$submitinfo > 0) {
            locationtable <<- rbind(locationtable,
                                    data.frame(Nym=input$name,
                                         Contact=input$contact,
                                         Longitude=input$plotclick$x,
                                         Latitude=input$plotclick$y,
                                         Radius=input$radius))
        }
        print(locationtable)
      }, 'include.rownames' = FALSE
       , 'include.colnames' = TRUE
       , 'sanitize.text.function' = function(x){x}
    )


    output$savemap <- downloadHandler(
        filename = function() {
            paste('fuzzymap-', Sys.Date(), '.png', sep="")
        },
        content = function(filecon) { # function to actually write the image file
            # http://stackoverflow.com/questions/14810409/save-plots-made-in-a-shiny-app?rq=1
            png(file)
            #print(
        })

    # output$savedata
})
