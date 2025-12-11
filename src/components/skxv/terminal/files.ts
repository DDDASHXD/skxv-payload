export interface FileNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: FileNode[]
}

const filesystem: FileNode[] = [
  {
    name: '/',
    type: 'directory',
    children: [
      {
        name: 'projects',
        type: 'directory',
        children: [
          {
            name: 'project1',
            type: 'file',
            content: 'This is the content of project1',
          },
          {
            name: 'project2',
            type: 'file',
            content: 'This is the content of project2',
          },
          {
            name: 'project3',
            type: 'file',
            content: 'This is the content of project3',
          },
        ],
      },
    ],
  },
]

export default filesystem
