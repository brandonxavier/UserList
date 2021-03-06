/**
 * Created with JetBrains WebStorm
 * User: brandonxavier
 * Date: 7/14/13
 *

 Copyright 2013 Brandon Xavier (brandonxavier421@gmail.com)

 This file is part of UserList.

 UserList is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 UserList is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with UserList.  If not, see <http://www.gnu.org/licenses/>.

 */


/**

 This defines an extensible object that can be used
 to maintain a list of users and some interesting
 info about them - nothing too cloak-n-dagger - just
 stuff like login time, recent tipping history, etc.

 */

function ObjectUserList() {

    this.list = [];
    this.add = add;
    this.remove = remove;
    this.get = get;
    this.sortBy = sortBy;
    this.tipped = tipped;
    this.message = message;

    // From http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
    this.sort_by = function(field, reverse, primer){

        var key = function (x) {return primer ? primer(x[field]) : x[field]};

        return function (a,b) {
            var A = key(a), B = key(b);
            return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];
        }
    };

    function add (userToAdd, delay) {

        if (delay == null){
            delay = 0;
        }

        var t = this.get(userToAdd['user']);
        if ( t == null ) {
            this.list.push(new ObjectUser(userToAdd));
        } else { // User exists, so update some stuff
            var d = new Date();
            if ( this.away && (d.getTime() - t.firstSeen.getTime())/1000 >= delay ){
                this.list.splice(this.list.indexOf(t),1);
                this.list.push(new ObjectUser(userToAdd)); // yeah, yeah, this could be done in the splice
            } else {
                t.away = false; // User must not be away
                t.in_fanclub = userToAdd['in_fanclub'];
                t.has_tokens = userToAdd['has_tokens'];
                t.is_mod = userToAdd['is_mod'];
                t.tipped_recently = userToAdd['tipped_recently'];
            }
        }
    }

    function remove(userToDelete){

        var t = this.get(userToDelete['user']);
        if (t != null ) {
            t.away = true;
        }

    }

    function get(searchFor) {

        var i = 0;

        while ( i < this.list.length && this.list[i].name != searchFor ){
            i++;
        }
        return ( i < this.list.length ? this.list[i] : null );

    }

    function sortBy(sortKey, ascending, primer) {

        this.list.sort(this.sort_by(sortKey, ascending, primer));

    }

    function tipped(tip) {

        var t = this.get(tip['from_user']);

        t.away = false;
        t.in_fanclub = tip['from_user_in_fanclub'];
        t.has_tokens = tip['from_user_has_tokens'];
        t.is_mod = tip['from_user_is_mod'];
        t.tipped_recently = tip['from_user_tipped_recently'];

        t.tipCount++;
        t.tipTotal += tip['amount'];
        t.tipAvg = t.tipTotal / t.tipCount;

    }

    function message(msg) {

        var t = this.get(msg['user']);

        t.away = false; // User must not be away
        t.in_fanclub = msg['in_fanclub'];
        t.has_tokens = msg['has_tokens'];
        t.is_mod = msg['is_mod'];
        t.tipped_recently = msg['tipped_recently'];

        t.chatCount++;
        t.lastChat = msg['m'];

    }

} // End of ObjectUserList




function ObjectUser (user) {

    // Standard vars passed from CB
    this.name = user['user'];
    this.in_fanclub = user['in_fanclub'];
    this.has_tokens = user['has_tokens'];
    this.is_mod = user['is_mod'];
    this.tipped_recently = user['tipped_recently'];
    this.gender = user['gender'];

    // Stuff that IMHO could be handy
    this.firstSeen = new Date();
    this.away = false;

    this.tipCount = 0;
    this.tipTotal = 0;
    this.tipAvg = 0;

    this.chatCount = 0;
    this.lastChat = "";

} // End of ObjectUser



