import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

let fakeExpenses: Expense[] = [
  { id: 1, title: "Expense 1", amount: 1 },
  { id: 2, title: "Expense 2", amount: 2 },
  { id: 3, title: "Expense 3", amount: 3 },
];

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), (c) => {
    const expense = { ...c.req.valid("json"), id: fakeExpenses.length + 1 };
    fakeExpenses.push(expense);
    c.status(201);
    return c.json(fakeExpenses);
  })
  .get("/total-spent", (c) => {
    return c.json(fakeExpenses.reduce((a, b) => a + b.amount, 0));
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = +c.req.param().id;
    const expense = fakeExpenses.find((exp) => exp.id === id);
    return expense ? c.json(expense) : c.notFound();
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = +c.req.param().id;
    const expense = fakeExpenses.find((exp) => exp.id === id);
    if (!expense) return c.notFound();
    fakeExpenses = fakeExpenses.filter((exp) => exp.id === id);

    return c.json(fakeExpenses);
  });
