Info
------------

### What is this?

Fuzzy Locator is a toy app that demonstrates the concept of *differential privacy* in announcing your location.  As Cynthia Dwork [showed in 2006](http://www.msr-waypoint.com/pubs/64346/dwork.pdf), it is impossible to create a database that is of use to anybody and guarantee *absolute privacy* at the same time. One approach to mitigating this risk is adding exponentially distributed noise to the data, as mentioned in the paper.

### Why?

Back in the 1990s, when the Internet was wild and free, kids (and adults, and aliens, and creatures from Beyond) would get on relatively anonymous chats like IRC and speak pretty frankly about whatever they were thinking, in whatever chatroom they happened to be in at the time. Just about nobody used their "real" names, though, and there weren't many data mining algorithms in play to pry that information out of their speaking style. One way to get to know somebody was to ask, `a/s/l?`. This was short for "what's your age, sex, and location?" Naturally, you were free to answer however you liked, which made it that much more interesting.

Nowadays multinational conglomerates demand "real" names from their users, mainly for the purpose of recording/predicting their behavior and trying to get them to buy stuff. Your IP address gives away your location, [typically within a few hundred meters](http://www.ipfingerprints.com/). Algorithms have been developed to [figure out your gender](http://www.hackerfactor.com/GenderGuesser.php) (whatever that means) from the words you use.

There's not much room left for imagination these days.

If you *do* hide your IP address through something like [Tor](https://www.torproject.org/), or you're exploring a different identity, something like this tool might help bring some of that back.

### How it works

If you click somewhere on the map, and hit the "Draw Circle" button, a semi-transparent circle will appear near where you clicked. Specifically, it will have a radius as big as you set with the radius slider, and it will be randomly scooted in some direction according to the amount of noise you add with the jitter slider. You can pick whatever color feels right, too.

Feel free to click around and play with the controls. No matter how you set the jitter or the radius, the circle will always contain the location you clicked on initially. (The circle will never lie if you don't.)

Once you're happy with the result, you can enter whatever (pseudo)nym you like and any kind of contact info into the two text fields. If you hit "Submit Info", the position and radius of the circle will be added to the List tab. You can download the table as well as the map, if you like.

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