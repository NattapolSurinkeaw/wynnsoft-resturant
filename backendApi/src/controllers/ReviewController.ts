import { Review } from "./../models/review";
import moment from "moment";
import { validationResult } from "express-validator";
import { ReviewFashion } from "../models/reviewFashion";
export class ReviewController {
    

  OnGetReview = async (req: any, res: any) => {
    const finding = await Review.findAll({
      order: [["createdAt", "DESC"]],
    });
    const findingFashion = await ReviewFashion.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get data success.",
      reviews: finding,
      fashionReviews: findingFashion,
    });
  };
  OnUpdateReview = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Review.findOne({ where: { id: req.body.review_id } });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "review was not found.",
      });
    }
    try {
      finding.display = req.body.display;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "review was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnChangeStatusReview = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const section = req.params.section;
    const models: any = {
      review: Review,
      reviewfashion: ReviewFashion,
    };
    const selectedModel = models[section];

    if (selectedModel) {
      const finding = await selectedModel.update(
        {
          display: req.body.display,
        },
        {
          where: { id: req.body.id },
        }
      );
    }

    return res.status(200).json({
      status: true,
      message: "ok",
      description: "update review success.",
      section,
    });
  };
  OnDeleteReview = async (req: any, res: any) => {
    const section = req.params.section;
    const models: any = {
      review: Review,
      reviewfashion: ReviewFashion,
    };
    const selectedModel = models[section];
    
    if (selectedModel) {
      const finding = await selectedModel.destroy({
        where: { id: req.params.id },
      });
    }

    return res.status(200).json({
      status: true,
      message: "ok",
      description: "review was deleted.",
    });
  };
}
