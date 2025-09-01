import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Job } from "../../types";

export class TaskCreate extends OpenAPIRoute {
    schema = {
        tags: ["Jobs"],
        summary: "Create a new Job",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: Job,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created task",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    task: Job,
                                }),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();

        const taskToCreate = data.body;

        return {
            success: true,
            task: {
                name: taskToCreate.name,
            },
        };
    }
}
