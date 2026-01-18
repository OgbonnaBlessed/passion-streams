import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ContentModel, IContent } from "../models/content.model";

// GET /content
export const getContent = async (req: AuthRequest, res: Response) => {
  try {
    const module = req.query.module as string | undefined;
    const type = req.query.type as string | undefined;
    const category = req.query.category as string | undefined;

    const query: any = {};

    if (module) query.moduleAccess = module;
    if (type) query.type = type;
    if (category) query.category = category;

    const content: IContent[] = await ContentModel.find(query).exec();

    res.json(content);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch content", error: error.message });
  }
};

// GET /content/:id
export const getContentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const content = await ContentModel.findById(id).exec();
    if (!content) return res.status(404).json({ message: "Content not found" });

    res.json(content);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch content", error: error.message });
  }
};

// GET /content/search?q=&module=
export const searchContent = async (req: AuthRequest, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const module = req.query.module as string | undefined;

    const filter: any = {};
    if (module) filter.moduleAccess = module;

    const allContent: IContent[] = await ContentModel.find(filter).exec();

    const filtered = q
      ? allContent.filter(
          (item) =>
            item.title?.toLowerCase().includes(q.toLowerCase()) ||
            item.description?.toLowerCase().includes(q.toLowerCase())
        )
      : allContent;

    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
