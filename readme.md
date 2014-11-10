Info
------------

### What is this?

Fuzzy Locator is a toy app that (I hope) demonstrates the concept of *differential privacy* in announcing your location.

### Differential privacy

As Cynthia Dwork [showed in 2006](http://www.msr-waypoint.com/pubs/64346/dwork.pdf), it is impossible to create a database that is of use to anybody and guarantee *absolute privacy* at the same time. (This means that anytime someone tells you your info has been "anonymized" by removing your name in a database, they're misleading you.) One approach to mitigating this risk is adding exponentially distributed noise to the data, as mentioned in the paper. This allows one to reduce the amount of information leaked (arguably at the cost of reducing its utility--you're adding noise).

### Ok, so what?

Back in the 1990s, when the Internet was wild and free (kinda), kids (and adults, and aliens, and creatures from Beyond) could get on relatively anonymous chats like IRC and speak pretty frankly about whatever they were thinking, in whatever chatroom they happened to be in at the time. Just about nobody used their "real" names, though, and there weren't many data mining algorithms in play to pry identifiable information out of their speaking style. One way to get to know somebody was to ask, `a/s/l?`. This was short for "what's your age, sex, and location?" Naturally, you were free to answer however you liked.

Nowadays multinational conglomerates demand "real" names from their users, mainly for the purpose of recording/predicting their behavior and trying to get them to buy stuff. Your IP address gives away your location, [typically within a few hundred meters](http://www.ipfingerprints.com/). Algorithms have been developed to [figure out your gender](http://www.hackerfactor.com/GenderGuesser.php) (whatever that means) from the words you use.

There's not much room left for imagination these days.

If you *do* hide your IP address (and by extension, your location) through something like [Tor](https://www.torproject.org/), or you're exploring a different identity, something like this tool might help bring some of that back.

### How it works

The app serves up a world map that you can draw on. If you click the **Draw Circle** tool and click on the map, a semi-transparent circle will appear near where you clicked. Specifically, it will have a radius as big as you set with the **radius slider**, and it will be randomly scooted in some direction according to the position of the **noise slider**. You can pick whatever **color** feels right.

No matter how you set the jitter or the radius, the circle will always contain the location you clicked on initially. (The circle will never lie if you don't.)

Once you're happy with the result, you can enter whatever (pseudo)nym you like and any kind of contact info into the two text fields. When you hit Submit, the (randomly nudged) latitude and longitude of the circle, its radius, and your entered info will be added to the **list view**. Both the list view and map can be exported.

### Trying it out yourself

Clone the repo with the URL at the right, update the submodules, make sure you've got the gems, then fire up the controller with your favorite Ruby rack.

```
git clone https://github.com/talexand/fuzzylocator.git
git submodule update --init --recursive
sudo gem install sinatra mongo json/ext csv builder
cd fuzzylocator/
ruby sinatracontroller.rb
```

### Licensing
This application and all original code used therein are licensed under the GPLv3.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

**Fuzzy Locator** copyright (C) 2014 Team Pizza
