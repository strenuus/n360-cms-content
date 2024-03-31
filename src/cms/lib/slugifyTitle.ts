import slugify from 'slugify';
import { Map } from 'immutable';

type Entry = Map<string, any>;

export default function slugifyTitle(entry: Entry): Entry {
  if (!entry.get("newRecord")) return entry;

  const currentValue = entry.getIn(["data", "slug"], "");
  if (currentValue !== "__unset__") return entry;

  const title = entry.getIn(["data", "title"], "");
  if (!title) return entry;

  const slug = slugify(title, { lower: true, strict: true });

  const data = entry.get("data").set("slug", slug)

  return entry.set("data", data)
}
