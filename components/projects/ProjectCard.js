import Link from 'next/link';
import Image from 'next/image';

const ProjectCard = ({ project }) => {
    const progressPercentage = (project.currentAmount / project.goalAmount) * 100;
    const daysLeft = Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
                <Image
                    src={project.imageUrl || '/api/placeholder/400/200'}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-400 mb-2">
                    {project.title}
                </h3>

                <p className="text-secondary-400 mb-4 line-clamp-2">
                    {project.description}
                </p>

                <div className="mb-4">
                    <div className="flex justify-between text-sm text-secondary-400 mb-1">
                        <span>${project.currentAmount.toLocaleString()}</span>
                        <span>${project.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-sm text-secondary-400 mt-1">
                        <span>{Math.round(progressPercentage)}% funded</span>
                        <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-400">
                        {project.backers?.length || 0} backers
                    </span>
                    <Link
                        href={`/projects/${project._id}`}
                        className="btn bg-red-500 px-3 py-2"
                    >
                        View Project
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;