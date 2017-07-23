# Upflow: a flexible productivity blocker for Chrome (proof-of-concept)

### How other blockers work
Most productivity blockers available to the Chrome browser allow you to set the amount of unproductive time you allow yourself every day or by day of the week. When you use up your daily quota on "unproductive" sites, the application will block you from visiting these sites until the following day. If you blow through your allotted time right at the start of the day, you may find yourself hunting for workarounds instead of getting to work or unable to take any further breaks no matter how productive you are.

### How Upflow works
Upflow approaches productivity by focusing on your *rate of work*. For any given unit of time, you would like to be productive for some proportion of it. Suppose you have 12 hours during which to be productive. Rather than say "I will only goof off 2 hours a day" you would say "I will only goof off 10 minutes per hour". Or, if you prefer the option of having longer breaks, you could say "I will only goof off for 20 minutes every other hour". Upflow will track time spent on unproductive sites over a trailing window to enforce this rate of work.

You can even use Upflow as a binge-breaker. After all, you can also set things up so that "I will goof off for 55 minutes for every hour", which will force you to step away for five minutes (in aggregate across the last hour).

With Upflow, you set:
- The "unit" of time to track (e.g., hour, two hours, etc.)
- The amount of time to be productive
- Website blacklist to considered to be "unproductive"

That's it! With these three components, Upflow will flexibly allow you to take breaks whenever you want, provided you are still at least as productive as your "rate of work".

### Installation
Since this extension is still in its early stages of development, it is not available in the Chrome Web Store.

To install this extension, first navigate to the directory path in which you'd like to store this repository and then clone it:

`$ git clone https://github.com/circld/upflow`

You will need `d3.min.js` in the main `upflow` directory, which you can download [here](https://github.com/d3/d3/releases).

Finally, follow [these instructions](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension into Chrome.


### Usage
Future planned improvements include adding an options page to allow easy user configuration, but in this early version, values need to be modified directly in the source code.

The variables to set are located in `background.js`: `upTimeSet` and `downTimeSet`. These represent "productive" and "unproductive" time in seconds, respectively. For instance, to have 10 minutes of goofing per hour, set `upTimeSet = 50 * 60` and `downTimeSet = 10 * 60`.
