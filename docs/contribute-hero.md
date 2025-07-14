# Add missing Hero Data

To add any of the missing heroes, their card need to be added to the database. The list of
cards for a hero follow the same layout (as an example have a a look at [Arien's](../build/data/cards/arien.json) cards):

```ts
type CardJSON = {
    id: string; // all lowercase: %hero-shortcode%-%color%-%tier%-%name_NonAlphaNumToDash%
    name: string;
    color: 'gold' | 'silver' | 'red' | 'blue' | 'green' | 'ultimate' | 'black' | 'purple';
    tier: 'I' | 'II' | 'III' | 'IV' | 'H' | null; 
    type: string; // (Basic) Skill / Attack (Ranged)
    text: string; // simple markdown support (italics, bold, newlines, ...)
}[];
```

If you want to contribute please propose a Pull Request or provide the necessary hero information as
a [Github Issue](https://github.com/yvo-niedrich/goa2-faq/issues/new?title=New%20Hero%3A%20%3CNAME%3E&labels=%22help%20wanted%22).